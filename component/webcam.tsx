import React from 'react'
import Webcam from "react-webcam";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

export const WebCam = () => {
    const webcamRef: any = React.useRef(null);
    const [screenShot, setScreenShot] = React.useState<any>(null)

    const capture = React.useCallback(
        () => {
          const imageSrc = webcamRef.current.getScreenshot();
          setScreenShot(imageSrc)
        },
        [webcamRef]
      );

  return (
    <div>  <Webcam
    audio={false}
    height={100}
    ref={webcamRef}
    screenshotFormat="image/jpeg"
    width={400}
    videoConstraints={videoConstraints}
  />
  <button className='border p-2 bg-black text-white rounded-xl mt-3' onClick={capture}>Capture photo</button>
</div>
  )
}
