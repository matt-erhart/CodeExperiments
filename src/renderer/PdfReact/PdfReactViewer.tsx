// libs
import * as React from "react";
import * as _pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry"; // maybe not needed?
if (typeof window !== "undefined" && "Worker" in window) {
  _pdfjs.GlobalWorkerOptions.workerPort = new Worker("./pdf.worker.entry.js");
}
import { PDFJSStatic } from "pdfjs-dist";
const pdfjs: PDFJSStatic = _pdfjs as any;
import { useEffect, useState } from "react";

// custom
import PageCanvas from "./PageCanvas";
import { domIdWithUid, domIds } from "./events";

export const PdfReactViewer = (props = { scale: 1 }) => {
  const [pages, setPages] = useState(null);
  const [scale, setScale] = useState(props.scale);

  useEffect(() => {
    loadPdfPages(
      require("./Understanding the Group Size Effect in Electronic Brainstorming.pdf")
    ).then(pages => {
      setPages(pages);
      console.log("pages: ", pages);
    });
  }, []);

  return (
    <div>
      {!!pages && (
        // <PageCanvas page={pages[0].page} viewport={pages[0].viewport} />
        <PdfPages scale={2} pages={pages} />
      )}
    </div>
  );
};

import { PdfPageOuter } from "../StyledComponents";
const PdfPages = ({ pages, scale }) => {
  if (pages.length < 1) return null;
  const Pages = pages.map(page => {
    let { width, height } = page.page.getViewport({scale});

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
        <PageCanvas
          id={domIdWithUid(domIds.pdfCanvas, page.pageNumber)}
          key={domIdWithUid(domIds.pdfCanvas, page.pageNumber)}
          page={page.page}
          scale={scale}
        />
        )
      </PdfPageOuter>
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
