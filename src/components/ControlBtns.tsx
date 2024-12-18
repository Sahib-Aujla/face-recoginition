import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store";
import { startWebCam, stopWebCam } from "../store/webcamSlice";
import { Button } from "react-bootstrap";
const ControlBtns = () => {
  const dispatch = useAppDispatch();
  const isOn = useSelector((state: RootState) => state.webcamReducer.isOn);

  return (
    <div className="mb-3 d-flex justify-content-center">
      {isOn ? (
        <Button variant={"danger"} onClick={() => dispatch(stopWebCam())}>
          Stop Video
        </Button>
      ) : (
        <Button variant="primary" onClick={() => dispatch(startWebCam())}>
          Start Video
        </Button>
      )}
    </div>
  );
};

export default ControlBtns;
