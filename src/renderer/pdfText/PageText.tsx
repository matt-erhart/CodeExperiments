import jsonText from "./json/textToDisplay-page0001.json";
import jsonText2 from "./json/textToDisplay-page0002.json";

import * as React from "react";
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect
} from "react";
import styled from "styled-components";
import search from "approx-string-match";
const numberRange = (start, end) =>
  [...Array(end + 1 - start).keys()].map(k => k + start);
import { getElementScale } from "../../utils";

const pagesOfText = [jsonText, jsonText2];

const pageOfTextItems = (jsonText as {
  text: TextItem[];
  pageNumber: number;
  viewportFlat: ViewportFlat;
}).text;

const viewportFlat = (jsonText as {
  text: TextItem[];
  pageNumber: number;
  viewportFlat: ViewportFlat;
}).viewportFlat;

export function getRegexIndexes(str: string, regex: RegExp): number[] {
  var re = regex;
  let match;
  let results = [];
  do {
    match = re.exec(str);
    if (match) {
      results.push(match.index);
    }
  } while (match);
  return results;
}

const pageOfTextItemsToString = pageOfTextItems => {
  let pageString = pageOfTextItems[0].str;
  let offsets = [
    {
      id: pageOfTextItems[0].id,
      charRangeInclusive: [0, pageOfTextItems[0].str.length - 1]
    }
  ];
  for (let textItem of pageOfTextItems.slice(1)) {
    const newString = textItem.str.toLowerCase();
    const startIx = pageString.length;
    pageString += newString;
    offsets.push({
      id: textItem.id,
      charRangeInclusive: [startIx, pageString.length - 1]
    });
  }
  return { pageString, textItemLocations: offsets };
};

const matchToHighlightIxs = (matches: ReturnType<typeof search>, offsets) => {
  const hightlightIxs: {
    ix: number;
    charStart: number;
    charEnd: number;
  }[] = [];
  for (let match of matches) {
    let ixStart = -1;
    let ixEnd = -1;
    let charStart = -1;
    let charEnd = -1;
    for (const [offsetIx, _offset] of offsets.entries()) {
      const offset = offsets[offsetIx];
      if (ixStart === -1) {
        const isStartInOffset =
          match.start >= offset.charRangeInclusive[0] &&
          match.start <= offset.charRangeInclusive[1];
        if (isStartInOffset) {
          ixStart = offsetIx;
          charStart = match.start - offset.charRangeInclusive[0];
        }
      }
      if (ixStart > -1) {
        const isEndInOffset =
          match.end >= offset.charRangeInclusive[0] &&
          match.end <= offset.charRangeInclusive[1];
        if (isEndInOffset) {
          ixEnd = offsetIx;
        }
      }
      if (ixEnd > -1) {
        charEnd = match.end - offset.charRangeInclusive[0];
        if (charStart === -1) charStart = 0;
        break;
      }
    }

    const allNumbers = numberRange(ixStart, ixEnd);
    const highlights = allNumbers.map((num, i) => {
      let res = { ix: num, charStart: 0, charEnd: Infinity };
      if (i === 0) res = { ...res, charStart };
      if (i === allNumbers.length - 1) res = { ...res, charEnd };
      return res;
    });
    hightlightIxs.push(...highlights);
  }
  return hightlightIxs;
};

const test = (stringToFind = "work") => {
  const findStr = stringToFind.toLowerCase();

  let { pageString, textItemLocations: offsets } = pageOfTextItemsToString(
    pagesOfText[0].text
  );

  var matches = search(pageString, findStr, 6 /* max errors */);

  const hightlightIxs = matchToHighlightIxs(matches, offsets);

  return hightlightIxs.reduce((all, val, ix) => {
    return {
      ...all,
      [val.ix]: { charStart: val.charStart, charEnd: val.charEnd }
    };
  }, {}) as { [id: number]: { charStart: number; charEnd: number } };
};

const computeStyle = (
  textItem: TextItem,
  scale: number,
  scaleX: number,
  hightlight: boolean
): React.CSSProperties => {
  return {
    height: "1em",
    fontFamily: `${textItem.fontName}, ${textItem.fallbackFontName}}`,
    fontSize: `${textItem.fontHeight * scale}px`,
    position: "absolute",
    top: textItem.top * scale + 1 + Math.round(textItem.style.ascent * scale),
    left: textItem.left * scale,
    transform: `scaleX(${scaleX})`,
    transformOrigin: "left bottom",
    whiteSpace: "pre",
    color: "black"
    // backgroundColor: hightlight ? "lightblue" : "white"
    // userSelect: "none",
    // outline: '1px solid lightgrey',
  };
};

export const PageText = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [highlights, setHighlights] = useState({});

  useEffect(() => {
    const highlight = test();
    setHighlights(highlight);
  }, []);

  return (
    <Div100vh
      style={{ width: viewportFlat.width, height: viewportFlat.height }}
      ref={ref}
    >
      {pageOfTextItems.map((text, ix) => {
        return (
          <CanvasAdjustedTextFragment
            key={text.id}
            // style={computeStyle(text, 1, 1)}
            textItem={text}
            highlight={highlights[ix]}
          >
            {text.str}
          </CanvasAdjustedTextFragment>
        );
      })}
    </Div100vh>
  );
};

const styleScaleX = (style, scaleX: number) => ({
  ...style,
  transform: `scaleX(${scaleX})`
});

const SpansFromHighlight = (text, highlight) => {
  if (!highlight || !text) return text;
  const { charStart, charEnd } = highlight;

  if (charStart + charEnd === 0) {
    return text;
  } else if (charStart === 0 && charEnd === Infinity) {
    return <span style={{ fontWeight: "bold" }}>{text}</span>;
  } else {
    return (
      <>
        {text.slice(0, charStart)}
        <span key="1" style={{ fontWeight: "bold", color: "blue" }}>
          {text.slice(charStart, charEnd)}
        </span>
        <span key="2">{text.slice(charEnd)}</span>
      </>
    );
  }
};

const CanvasAdjustedTextFragment = (props: {
  textItem: TextItem;
  children: React.ReactNode;
  highlight: { charStart: number; charEnd: number };
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scaleX, setScaleX] = useState(1);
  useLayoutEffect(() => {
    const { elementRect, ...scale } = getElementScale(ref.current);
    setScaleX((props.textItem.width * scale.scaleX) / elementRect["width"]); // textItem.width from canvas render
  }, []);

  return (
    <TextDiv
      ref={ref}
      id={props.textItem.id}
      key={props.textItem.id}
      style={computeStyle(props.textItem, 1, scaleX, !!props.highlight)}
      title={props.textItem.width + ""}
    >
      {SpansFromHighlight(props.textItem.str, props.highlight)}
    </TextDiv>
  );
};

export const TextDiv = styled.div`
  user-select: text;
  pointer-events: all;

  /* border: 1px solid lightgray; */
`;

export const Div100vh = styled.div`
  border: 1px solid green;
  transform: scale(2);
  transform-origin: left top;
  user-select: none;
  pointer-events: none;
`;

export interface ViewportFlat {
  height: number;
  width: number;
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
}

export interface Style {
  fontFamily: string;
  ascent: number;
  descent: number;
}
export interface TextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  id: string;
  top: number;
  left: number;
  fontHeight: number;
  fontWidth: number;
  scaleX: number;
  fallbackFontName: string;
  style: Style;
}
