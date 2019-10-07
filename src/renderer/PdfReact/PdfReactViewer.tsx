// libs
import * as React from "react";
import * as _pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry"; // maybe not needed?
if (typeof window !== "undefined" && "Worker" in window) {
  _pdfjs.GlobalWorkerOptions.workerPort = new Worker("./pdf.worker.entry.js");
}
import { PDFJSStatic } from "pdfjs-dist";
const pdfjs: PDFJSStatic = _pdfjs as any;
import { useEffect, useState, useRef, useCallback } from "react";
import VisibilitySensor from "react-visibility-sensor";

// custom
import PageCanvas from "./PageCanvas";
import { PageBoxes } from "./PageBoxes";
import { domIdWithUid, domIds } from "./events";
import electronState from "../EntryPoints/state.json";

const defaultProps = {
  scale: 2,
  width: undefined as number | string,
  height: "" as number | string,
  scrollToLeft: 0,
  scrollToTop: 1110,
  scrollToPageNumber: 2,
  loadPageNumbers: [] as number[],
  displayMode: "full" as "full" | "box"
};

const useLoadPdfPages = (path: string) => {
  const [pages, setPages] = useState([]);
  const [pdfHashId, setPdfHash] = useState("");
  useEffect(() => {
    // LOAD PAGES
    loadPdfPages(path).then(pages => {
      setPdfHash(pages[0].page._transport.pdfDocument._pdfInfo.fingerprint);
      setPages(pages);
    });
  }, []);

  return { pages, pdfHashId };
};

const useLoadBoxSegments = (
  props = { nodes: [], pdfHashId: "", loadPageNumbers: [] }
) => {
  const segments = props.nodes.filter(n => {
    return (
      n.data.type === "pdf.segment.viewbox" &&
      n.data.pdfDir === props.pdfHashId &&
      (props.loadPageNumbers.includes(n.data.pageNumber) ||
        props.loadPageNumbers.length === 0)
    );
  });
  return segments;
};

interface BoxSegments {
  id: string;
  data: {
    left: number;
    top: number;
    height: number;
    width: number;
  };
}


export const PdfViewer = _props => {
    // should build overlays here
  const props = { ...defaultProps, ..._props };
  const { pages, pdfHashId } = useLoadPdfPages(
    require("./Understanding the Group Size Effect in Electronic Brainstorming.pdf")
  );
  const boxes = useLoadBoxSegments({
    nodes: Object.values(electronState.graph.nodes),
    loadPageNumbers: props.loadPageNumbers,
    pdfHashId
  });
  if (pages.length < 1 || boxes.length < 1) return null;

  const {
    pdfDir,
    left,
    top,
    scale,
    pageNumber,
    scalePreview,
    height,
    width
  } = boxes[0].data;
  const pagenum = [pageNumber];

  const {
    max: { scrollToLeft, scrollToTop }
  } = boxes[0].style;
  

  return (
    <PdfPagesOuter
      key={"1" + boxes[0].id}
      height={height*2}
      width={(width+(width/4))}
      loadPageNumbers={pagenum}
      scrollToLeft={scrollToLeft}
      scrollToTop={scrollToTop}
      scrollToPageNumber={pageNumber}
      scale={2}
      pages={pages}
      boxes={boxes}
    />
  );
  // return <PdfPagesOuter pages={pages} />;
};

export const PdfPagesOuter = _props => {
  const props = { ...defaultProps, ..._props };
  const pages = props.pages;
  const [scale, setScale] = useState(props.scale || 1);

  const scrollRef = useRef<HTMLDivElement>(null);
  const track = useRef({ scale, pages }); // need in hooks, but don't want to rerun effect
  useEffect(() => {
    track.current = { pages, scale };
  }, [pages, scale]);

  const scrollRefCallback = useCallback(
    node => {
      // called when react assigns the ref to the html node which is after pages.length > 0
      if (node !== null && !scrollRef.current) {
        const pagesOffset = getPageOffset(pages, props.scrollToPageNumber);
        node.scrollTo(props.scrollToLeft, (props.scrollToTop*scale) + pagesOffset);
        scrollRef.current = node;
      }
    },
    [props]
  );
  useEffect(() => {
    // if we pass in new scroll
    if (!scrollRef.current || !track.current || props.displayMode === "box")
      return undefined;
    const pagesOffset = getPageOffset(pages, props.scrollToPageNumber);
    scrollRef.current.scrollTo(
      props.scrollToLeft * track.current.scale,
      props.scrollToTop * track.current.scale + pagesOffset
    );
  }, [track, props.scrollToLeft, props.scrollToTop, props.loadPageNumbers]);

  if (pages.length < 1) return null; // required for scrollTo on mount to work
  return (
    <div
      id="scrollPdf"
      ref={scrollRefCallback}
      onWheel={onWheel(setScale, scrollRef.current)}
      style={{
        overflow: "scroll",
        height: props.height ? props.height : "auto",
        width: props.width ? props.width : "auto",
        flex: 1
      }}
    >
      <PdfPages scale={scale} pages={pages} boxes={props.boxes} />
    </div>
  );
};
//onWheel={onWheel(setScale)}
const onWheel = (
  setScale: React.Dispatch<React.SetStateAction<number>>,
  el
) => (e: React.WheelEvent<HTMLDivElement>) => {
  e.persist();
  if (e.ctrlKey) {
    e.preventDefault();
    setScale(prevScale => {
      const newScale = prevScale - e.deltaY / 1000;
      const res = newScale >= 0.5 ? newScale : 0.5;
      return res;
    });
  }
};

const getPageOffset = (pages, pageNumber) => {
  return pages.reduce((sum, page) => {
    if (page.pageNumber < pageNumber) {
      sum += page.viewport.height;
    }
    return sum;
  }, 0);
};

import { PdfPageOuter } from "../StyledComponents";
const PdfPages = ({ pages, scale, boxes }) => {
  if (pages.length < 1) return null;
  const Pages = pages.map((page, ix) => {
    let { width, height } = page.page.getViewport({ scale });

    return (
      <VisibilitySensor key={ix} partialVisibility={true}>
        {({ isVisible }) => {
          return (
            <PdfPageOuter
              draggable={false}
              id={domIdWithUid(domIds.page, page.pageNumber)}
              key={domIdWithUid(domIds.page, page.pageNumber)}
              style={{
                width: width,
                minWidth: width,
                height: height
              }}
            >
              {isVisible && (
                <>
                  <PageBoxes
                    id={domIdWithUid(domIds.boxSegments, page.pageNumber)}
                    boxes={scaledBoxesForPage(boxes, page.pageNumber, scale)}
                    pageHeight={height / scale}
                    pageWidth={width / scale}
                    scale={scale}
                    onChange={() => {}}
                  />
                  <PageCanvas
                    id={domIdWithUid(domIds.pdfCanvas, page.pageNumber)}
                    key={domIdWithUid(domIds.pdfCanvas, page.pageNumber)}
                    page={page.page}
                    scale={scale}
                    viewport={page.viewport}
                  />
                </>
              )}
            </PdfPageOuter>
          );
        }}
      </VisibilitySensor>
    );
  });
  return Pages;
};

// utils
export const loadPdfPages = async (
  path: string,
  pageNumbersToLoad: number[] = [],
  scale = 1,
  isLocalFile = false
) => {
  // osx+pdfjs+electron needs new Uint8Array(fs.readFileSync(path)) NOT pdfjs.getDocument(path);
  const loadingTask = pdfjs.getDocument(path);
  loadingTask.onProgress = function(progress) {
    var percent = (progress.loaded / progress.total) * 100;
  };

  const pdf = await loadingTask.promise; //558ms for 21 pages

  const pageNumbers = checkGetPageNumsToLoad(pdf.numPages, pageNumbersToLoad);
  let pages = [] as _pdfjs.PDFPageProxy[];
  for (const pageNumber of pageNumbers) {
    const page = await pdf.getPage(pageNumber); //1ms
    pages.push({
      page,
      pageNumber: pageNumber,
      viewport: page.getViewport({ scale })
    });
  }

  return pages;
};

export const checkGetPageNumsToLoad = (
  numPages,
  pageNumbersToLoad: number[]
) => {
  const allPageNumbers = [...Array(numPages).keys()].map(x => x + 1);
  const willLoadAllPages = pageNumbersToLoad.length === 0;
  const pageNumPropsOk =
    !willLoadAllPages &&
    Math.min(...pageNumbersToLoad) >= 0 &&
    Math.max(...pageNumbersToLoad) <= Math.max(...allPageNumbers);

  let pageNumbers;
  if (willLoadAllPages) {
    pageNumbers = allPageNumbers;
  } else {
    pageNumbers = pageNumPropsOk ? pageNumbersToLoad : allPageNumbers;
  }

  return pageNumbers;
};

// BOXES
const scaledBoxesForPage = (boxes, pageNumber, scale) => {
  // so now we scale with css so scale at capture is 1
  return boxes
    .filter(b => b.data.pageNumber === pageNumber)
    .map(b => {
      const { left, top, width, height, scale: scaleAtCapture } = b.data;
      return {
        ...b,
        data: {
          ...b.data,
          id: b.id,
          left: left / scaleAtCapture,
          top: top / scaleAtCapture,
          width: width / scaleAtCapture,
          height: height / scaleAtCapture,
          scale: scaleAtCapture
        }
      };
    });
};
