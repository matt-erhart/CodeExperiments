// Replaces PdfViewer
// libs
import * as React from "react";
import * as _pdfjs from "pdfjs-dist";
var PdfjsWorker = require("pdfjs-dist/lib/pdf.worker.js");
if (typeof window !== "undefined" && "Worker" in window) {
  (_pdfjs as any).GlobalWorkerOptions.workerPort = new PdfjsWorker();
}
//try '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.js'
import {
  PDFJSStatic,
  PDFDocumentProxy,
  PDFInfo,
  PDFMetadata,
  PDFTreeNode
} from "pdfjs-dist";
const pdfjs: PDFJSStatic = _pdfjs as any;
import jsonfile = require("jsonfile");
import path = require("path");
import styled from "styled-components";
import {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback
} from "react";
// custom
import { PageBoxes } from "./PageBoxes";
import {
  loadPdfPages,
  loadPageJson,
  PageOfText,
  checkGetPageNumsToLoad
} from "./io";
import PortalContainer from "./PortalContainer";
import PageCanvas from "./PageCanvas";
import { iRootState, dispatch } from "../store/createStore";
import { Box } from "./geometry";
import { useSelector } from "react-redux";
import {
  makePdfSegmentViewbox,
  makeLink,
  PdfSegmentViewbox
} from "../store/creators";

export type LoadFile = { rootDir: string; dir: string };
export type LoadUrl = string;

const defaultProps = {
  scale: 1,
  width: undefined as number | string | undefined,
  height: undefined as number | string | undefined,
  scrollToLeft: 0,
  scrollToTop: 0,
  scrollToPage: 1,
  loadPageNumbers: [] as number[]
};

type OptionalProps = Partial<typeof defaultProps>;

interface RequiredProps {
  load: LoadFile; // todo | LoadUrl;
}

export const Pdf = (_props: OptionalProps & RequiredProps) => {
  const props = { ...defaultProps, ..._props };
  const boxes: PdfSegmentViewbox[] = useSelector((state: iRootState) => {
    return Object.values(state.graph.nodes).filter(n => {
      return (
        n.data.type === "pdf.segment.viewbox" &&
        n.data.pdfDir === props.load.dir &&
        props.loadPageNumbers.includes(n.data.pageNumber)
      );
    });
  });
  console.log("boxes: ", boxes);

  const [pages, setPages] = useState([]);
  const loadPdf = async () => {
    const { dir, rootDir } = props.load;
    const pages = await loadFiles({
      pageNumbersToLoad: [1],
      pdfDir: dir,
      pdfRootDir: rootDir,
      scale: props.scale
    }); // todo load in order
    setPages(pages);
  };

  useEffect(() => {
    loadPdf();
  }, []);

  const renderPages = pages => {
    if (pages.length < 1) return null;
    const Pages = pages.map(page => {
      const { width, height } = page.viewport;

      return (
        <div
          draggable={false}
          id="pdf-page"
          key={page.pageNumber}
          style={{
            width,
            minWidth: width,
            height,
            position: "relative",
            borderBottom: "1px solid lightgrey"
          }}
        >
          <PageBoxes
            boxes={scaledBoxesForPage(boxes, page.pageNumber, props.scale)}
            pageHeight={height}
            pageWidth={width}
            onAddBox={addBoxToGraph({
              pdfDir: props.load.dir,
              pageNumber: page.pageNumber,
              scale: props.scale
            })}
          />

          <PageCanvas
            id={"canvas-" + page.pageNumber}
            key={"canvas-" + page.pageNumber}
            page={page.page}
            viewport={page.viewport}
          />
        </div>
      );
    });
    return Pages;
  };

  return (
    <div style={{ overflow: "scroll", height: "100vh" }}>
      {renderPages(pages)}
    </div>
  );
};

const scalePages = (pages: any[], scale: number) => {
  // todo css transform scale and then when rendered swap it
  let scaledPages = [];
  for (let [ix, page] of pages.entries()) {
    const viewport = page.page.getViewport(scale);
    scaledPages.push({ ...page, viewport });
  }
  return scaledPages;
};

const scaledBoxesForPage = (boxes, pageNumber, scale) => {
  return boxes
    .filter(b => b.data.pageNumber === pageNumber)
    .map(b => {
      const { left, top, width, height, scale: scaleAtCapture } = b.data;
      return {
        ...b,
        data: {
          ...b.data,
          id: b.id,
          left: (left / scaleAtCapture) * scale,
          top: (top / scaleAtCapture) * scale,
          width: (width / scaleAtCapture) * scale,
          height: (height / scaleAtCapture) * scale,
          scale: scaleAtCapture
        }
      };
    });
};

const loadFiles = async (props: {
  pageNumbersToLoad: number[];
  pdfDir: string;
  pdfRootDir: string;
  scale: number;
}) => {
  const { pageNumbersToLoad, pdfDir, pdfRootDir, scale } = props;
  const fullDirPath = path.join(pdfRootDir, pdfDir);
  const pdfPath = path.join(fullDirPath, pdfDir + ".pdf");
  const seg = await jsonfile.readFile(
    path.join(fullDirPath, "userSegments.json")
  ); // todo userSegments only used for nPages currently

  const pageNumbersToLoadFixed = checkGetPageNumsToLoad(
    seg.numberOfPages,
    pageNumbersToLoad
  );

  const [pdfPages] = await Promise.all([
    loadPdfPages(pdfPath, pageNumbersToLoadFixed)
  ]);

  let pages = [];
  for (let i in pdfPages) {
    pages.push({
      page: pdfPages[i],
      pageNumber: pageNumbersToLoadFixed[i],
      viewport: pdfPages[i].getViewport(scale)
    });
  }
  return pages;
};

const addBoxToGraph = (pdfInfo: {
  scale: number;
  pageNumber: number;
  pdfDir: string;
}) => (box: Box) => {
  const { left, top, width, height } = box;
  const { scale, pageNumber, pdfDir } = pdfInfo;
  // note we save with scale = 1
  const boxNode = makePdfSegmentViewbox(
    {
      left,
      top,
      width,
      height,
      scale,
      pageNumber,
      pdfDir
    }
    // style, todo place with nextNodeLoc
  );

  const linkFromPdf = makeLink(pdfDir, boxNode.id, { type: "more" });
  console.log("linkFromPdf: ", linkFromPdf);
  // dispatch.graph.addBatch({ nodes: [boxNode], links: [linkFromPdf] });
  // dispatch.graph.toggleSelections({
  //   selectedNodes: [boxNode.id],
  //   clearFirst: true
  // });
  //10ms update with just a div
};
