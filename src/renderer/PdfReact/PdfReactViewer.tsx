// libs
import * as React from "react";
import * as _pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry"; // maybe not needed?
if (typeof window !== "undefined" && "Worker" in window) {
  _pdfjs.GlobalWorkerOptions.workerPort = new Worker("./pdf.worker.entry.js");
}
import { PDFJSStatic } from "pdfjs-dist";
const pdfjs: PDFJSStatic = _pdfjs as any;
import { useEffect, useState, useRef } from "react";
import VisibilitySensor from "react-visibility-sensor";

// custom
import PageCanvas from "./PageCanvas";
import { domIdWithUid, domIds } from "./events";

export const PdfReactViewer = props => {
  const [pages, setPages] = useState(null);
  const [scale, setScale] = useState(props.scale || 1);
  const ref = useRef<HTMLDivElement>(null);
  const [transStr, setTransString] = useState("");

  useEffect(() => {
    // LOAD PAGES
    loadPdfPages(
      require("./Understanding the Group Size Effect in Electronic Brainstorming.pdf")
    ).then(pages => {
      setPages(pages);
    });
  }, []);

  // TODO: show a viewbox, show it in the list, click the eye for full pdf modal
  // <Pdf
  // key={"1" + node.id}
  // loadPageNumbers={pagenum}
  // load={{ rootDir: pdfRootDir, dir: pdfDir }}
  // scrollToLeft={scrollToLeft * scalePreview}
  // scrollToTop={scrollToTop * scalePreview}
  // scrollToPageNumber={pageNumber}
  // scale={scalePreview}
  // displayMode="box"
  // onChange={event => {


  return (
    <div ref={ref} onWheel={onWheel(setScale, ref.current)}>
      {!!pages && (
        // <PageCanvas page={pages[0].page} viewport={pages[0].viewport} />
        <PdfPages scale={scale} pages={pages} />
      )}
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

import { PdfPageOuter } from "../StyledComponents";
const PdfPages = ({ pages, scale }) => {
  if (pages.length < 1) return null;
  const Pages = pages.map((page,ix) => {
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
                <PageCanvas
                  id={domIdWithUid(domIds.pdfCanvas, page.pageNumber)}
                  key={domIdWithUid(domIds.pdfCanvas, page.pageNumber)}
                  page={page.page}
                  scale={scale}
                  viewport={page.viewport}
                />
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
