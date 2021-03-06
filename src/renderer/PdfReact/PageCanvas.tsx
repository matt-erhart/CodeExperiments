import * as React from "react";
import * as pdfjs from "pdfjs-dist";
export const isCancelException = error =>
  error.name === "RenderingCancelledException" ||
  error.name === "PromiseCancelledException";
import { debounceTime, tap } from "rxjs/operators";
import { Subject } from "rxjs";

const PageCanvasDefaults = {
  props: {
    id: "",
    page: undefined as pdfjs.PDFPageProxy,
    viewport: undefined as pdfjs.PDFPageViewport,
    scale: 1
  },
  state: { isRendering: true }
};
export default class PageCanvas extends React.Component<
  typeof PageCanvasDefaults.props,
  typeof PageCanvasDefaults.state
> {
  state = PageCanvasDefaults.state;
  private subscription;
  private renderTask;
  private renderScale1Task;
  private canvasLayer = React.createRef<HTMLCanvasElement>();
  private canvasScale1 = React.createRef<HTMLCanvasElement>();
  // todo perf: use a ref callback to set the ref and then hide
  static defaultProps = PageCanvasDefaults.props;
  private subjectRendering = new Subject();

  scale1Canvas = async () => {
    // this gets a fast blurry css zoom while the slow, crisp pdf zoom happens
    // show this while zooming, show the other canvas when its ready
    const { page } = this.props;
    const viewport = page.getViewport({ scale: 1 });
    this.canvasScale1.current.height = viewport.height;
    this.canvasScale1.current.width = viewport.width;
    const canvasContext = this.canvasScale1.current.getContext("2d");
    if (
      this.renderScale1Task &&
      this.renderScale1Task._internalRenderTask.running
    ) {
      this.renderScale1Task.cancel();
    }

    this.renderScale1Task = page.render({ canvasContext, viewport }).promise;
    this.renderScale1Task
      .then(() => {
        this.renderScale1Task = null;
      })
      .catch(err => {
        if (isCancelException(err)) {
          return null;
        } else {
          throw err;
        }
      });
  };

  renderCanvas = async scale => {
    const { page } = this.props;
    const viewport = page.getViewport({ scale });
    this.canvasLayer.current.height = viewport.height;
    this.canvasLayer.current.width = viewport.width;
    const canvasContext = this.canvasLayer.current.getContext("2d");

    if (this.renderTask && this.renderTask._internalRenderTask.running) {
      this.renderTask.cancel();
    }

    this.renderTask = page.render({ canvasContext, viewport }).promise;

    this.renderTask
      .then(() => {
        this.renderTask = null;
        if (!!this.canvasLayer.current)
          this.canvasLayer.current.style.opacity = "1";
        this.setState({ isRendering: false });
      })
      .catch(err => {
        if (isCancelException(err)) {
          return null;
        } else {
          throw err;
        }
      });
  };

  async componentDidMount() {
    // if no render requests for 100ms, then call the func to render = smooth scroll
    this.subscription = this.subjectRendering
      .pipe(
        debounceTime(50),
        tap(async () => {
          this.setState({ isRendering: true });
          await this.renderCanvas(this.props.scale);
        })
      )
      .subscribe(() => {});
    this.scale1Canvas();
    this.renderCanvas(this.props.scale);

    this.setState({ isRendering: false });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  async componentDidUpdate(prevProps) {
    const { viewport, page, scale } = this.props;

    const figureprint1 = (page as any)._transport.pdfDocument._pdfInfo
      .fingerprint;
    const figureprint2 =
      prevProps.page._transport.pdfDocument._pdfInfo.fingerprint;

    if (prevProps.scale !== scale) {
      if (!!this.canvasLayer.current)
        this.canvasLayer.current.style.opacity = "0";
      this.subjectRendering.next("request render"); // so we can debounce rendering on zoom
    }

    if (figureprint1 !== figureprint2) {
      this.scale1Canvas();
      this.subjectRendering.next("request render"); // so we can debounce rendering on zoom
    }
  }

  shouldComponentUpdate(prevProps, prevState) {
    const scaleChange = prevProps.scale !== this.props.scale;

    const viewportChangeHeight =
      prevProps.viewport.height !== this.props.viewport.height;
    const viewportChangeWidth =
      prevProps.viewport.width !== this.props.viewport.width;
    const figureprint1 = (this.props.page as any)._transport.pdfDocument
      ._pdfInfo.fingerprint;
    const figureprint2 =
      prevProps.page._transport.pdfDocument._pdfInfo.fingerprint;
    const newPdf = figureprint1 !== figureprint2;

    return scaleChange || viewportChangeHeight || viewportChangeWidth || newPdf;
  }

  style = (props): React.CSSProperties => ({
    position: "absolute",
    transformOrigin: "top left",
    transform: `scale(${props.scale})`
  });

  canvasStyle: React.CSSProperties = {
    position: "absolute",
    transformOrigin: "top left",
    zIndex: 2
  };

  render() {
    return (
      <>
        <canvas
          draggable={false}
          style={this.canvasStyle}
          ref={this.canvasLayer}
        />
        <canvas
          draggable={false}
          style={this.style(this.props)}
          ref={this.canvasScale1}
        />
      </>
    );
  }
}
