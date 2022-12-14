
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { useState } from 'react'
import Webcam from "react-webcam";
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import axios from 'axios';
import { poster } from '../component/fetchet';
import toast from 'react-hot-toast';

let img = "/neu.jpeg"
const label_map = [{ name: 'Anger', icon: '😤' }, { name: 'Neutral', icon: '😶' }, { name: 'Fear', icon: '😨' }, { name: 'Happy', icon: '😅' }, { name: 'Sad', icon: '😢' }, { name: 'Surprise', icon: '😯' }]
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};
const Home: NextPage = () => {
  const [image, setImage] = useState<any>(null);
  const [createObjectURL, setCreateObjectURL] = useState<any>(null);
  const [res, setRes] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [screenShot, setScreenShot] = useState<any>(null)
  const [showCamera, setShowCamera] = useState<boolean>(true)

  const webcamRef: any = React.useRef(null);

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setScreenShot(imageSrc)
    },
    [webcamRef]
  );
  const uploadImage = async (event: any) => {
    event.preventDefault()
    const body = new FormData();
    body.append("file", image);
    const data: any = await poster('http://127.0.0.1:8000/upload-file/', body)
    console.log(data)
    if (data.status === 200) toast.success('image sent ')
    setRes(data)
  }
  console.log('res', res)

  const uploadToClient = async (event: any) => {
    setLoading(true)
    setScreenShot(null)
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      // toast.success('image uploaded')
      setCreateObjectURL(URL.createObjectURL(i));
      // if (i) {
      //   const body = new FormData();
      //   body.append("file", i);
      //   const res = await axios.post("http://127.0.0.1:8000/upload-file/", body
      //   );
      //   setRes(res)
      // }

    }
    setLoading(false)
  };
  const sendToBackend = async (event: any) => {
    event.preventDefault()
    const body = new FormData();
    body.append("file", screenShot);
    const data: any = await poster("http://127.0.0.1:8000/upload/", body
    );
    if (data.status === 200) toast.success('sent photo to Analyze')

  }
  console.log(showCamera)
  const Analyze = async (event: any) => {
    event.preventDefault();

    const data: any = await axios.get("http://127.0.0.1:8000/predict/")
    if (data === 200) toast.success('predicted')
    setRes(data.data)
  };

  const final: { name: string, icon: string }[] = label_map.filter((lab: any) => lab.name === res?.result)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Ai Facial Expression</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='py-20' >
        <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">


          <h1 className="text-6xl font-bold">
            Upload Image to{' '}
            <a className="text-violet-600" >
              Predict!
            </a>
          </h1>
          <p className="mt-3 text-2xl">
            Get started by uploading{' '}
            <code className="rounded-md bg-gray-100 p-3 font-mono text-lg">
              Image
            </code>
          </p>
          <em>Please use Human face</em>
          <div className="mt-6 flex max-w-6xl flex-wrap items-center justify-center gap-4 sm:w-full">
            <div>
              {screenShot ? (<img src={screenShot} className={` ${screenShot ? 'h-52 w-52 rounded-xl' : 'border border-slate-300 bg-gray-100 rounded-2xl h-52 w-52'} `} />) : (<img src={createObjectURL} className={` ${createObjectURL ? 'h-52 w-52 rounded-xl' : 'border border-slate-300 bg-gray-100 rounded-2xl h-52 w-52'} `} />)}

            </div>
            <form className='flex flex-col items-center justify-center'>
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex justify-center gap-3 items-center px-1 py-1 bg-white text-blue tracking-wide uppercase border border-blue cursor-pointe">
                  <svg className="w-3 h-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                  </svg>
                  <span className='text-sm'>upload</span>
                  <input className="hidden" id="default_size" type="file" onChange={uploadToClient} />

                </label>
              </div>

              <button
                className="mt-6 w-full border p-2 text-left hover:text-violet-600 focus:text-violet-600"
                onClick={(event) => { event?.preventDefault(); setShowCamera(!showCamera) }}
              >use camera</button>
              <button
                className="mt-6 w-full border p-2 text-left hover:text-violet-600 focus:text-violet-600"
                onClick={uploadImage}
              >Send To Back</button>
              <button
                className="mt-6 w-full border p-2 text-left hover:text-violet-600 focus:text-violet-600"
                onClick={Analyze}
              >Analyze</button>
            </form>

          </div>
          <div>
          </div>
          <div className="w-full flex flex-col justify-center mt-9 mb-4 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            {(final.length > 0) ? (
              <>
                <span className='text-3xl'>{final[0]?.icon}</span><a href="#">
                  <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">{final[0]?.name}</h5>
                </a>
              </>)
              : res?.error ? <p>{res?.error}</p> : 'No Data Yet'}
          </div>

        </div>
        <div className='flex flex-col gap-3 md:flex-row  justify-center items-center'>
          {showCamera && (<>
            <div className='flex flex-col rounded-2xl'>
              <Webcam
                audio={false}
                height={100}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={400}
                videoConstraints={videoConstraints}
              />
              <button className='border p-2 bg-black text-white rounded-xl mt-3' onClick={capture}>Capture photo</button>

            </div>
            {screenShot && (<div className='flex flex-col'>
              <img src={screenShot} />

              <button className='border p-2 bg-purple-500 text-white rounded-xl mt-3' onClick={sendToBackend}>Send Image</button>

            </div>)}

          </>)}

        </div>

      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center "
          href="https://iot.neu.edu.tr/"
          target="_blank"
          rel="noopener noreferrer"
        > AI and IoT {" "}
          <Image src={img} alt="Neu logo" className="h-100 w-50" width={172} height={100} />
        </a>
      </footer>
    </div>
  )
}

export default Home
