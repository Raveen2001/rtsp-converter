const express = require("express");
const app = express();
const child_process = require("child_process");
var child = null;
var children=[];

app.get("/camera/feed", (req, res) => {
  try {
    // if (child !== null) {
    //   console.log("child killed");
    //   child.kill();
    //   console.log("child killded 2nd time");
    //   child = null;
    //   // return;
    // }

    // const child_process = require("child_process");
    res.header("content-type", "video/webm");
    const rtsp_url = req.query.rtsp_url;

    console.log("hello rtsp --------->", rtsp_url);

    const cmd =
      `ffmpeg -i ${rtsp_url} -c:v copy -c:a copy -bsf:v h264_mp4toannexb -maxrate 500k -f matroska -`.split(
        " "
      );
    console.log(cmd);

    //   const cmd =
    //     `ffmpeg -i rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov -c:v copy -c:a copy -bsf:v h264_mp4toannexb -maxrate 500k -f matroska -`.split(
    //       " "
    //     );

    child = child_process.spawn(cmd[0], cmd.splice(1));
    console.log("New *** child ,",child.pid);
    if (children[0]){
      if(children[0]==child){
        console.log("WTFFFFFFFFFFFFFFFF!!!!!!");
        //
      }else{
        // children[0].kill();
        // children.pop();
        children.push(child);
      }
    }else{
      children.push(child);
    }
    if(children.length>3){
      children[0].kill();
      console.log("killed ",children[0].pid);
      children[1].kill();
      console.log("killed ",children[1].pid);
      children.pop();
      children.pop();
    }
    console.log("*** children:");
    children.forEach((c)=>{console.log(c.pid);});
    // {
    //   stdio: ["ignore", "pipe"],
    // }
    child.stdout.on("data", (data) => {
      // console.log(`stdout: ${data}`);
      // console.log("std out called", data);
    });

    child.stderr.on("data", (data) => {
      // console.log(`stderr: ${data}`);
    });

    child.on("error", (error) => {
      console.log("error --->", error);
    });
    child.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      if (child !== null) {
        child.kill();
        child = null;
      }
      res.end();
    });

    child.stdio[1].pipe(res);
  } catch (e) {
    console.log("ENded because: ", e.message);
    if (child !== null) {
      child.kill();
      child = null;
    }
    res.end();
  }
  // res.on("close", () => {
  //   // Kill ffmpeg if the flow is stopped by the browser
  //   child.kill();
  // });
});
app.listen(3004, () => {
  console.log("listening on port 3004");
});
