let child_process;
function rtspToHls(cam) {
  console.log(cam.camera_name);
  const child = require("child_process");
  const cmd = `ffmpeg -i ${
    cam.rtsp_url
  } -fflags flush_packets -max_delay 5 -flags -global_header -hls_time 5 -hls_list_size 3 -vcodec copy -y ip_cam_videos/${cam.camera_name
    .split(" ")
    .join("_")}.m3u8`.split(" ");
  console.log(cmd);
  child_process = child.spawn(cmd[0], cmd.splice(1));
  child_process.stdout.on("data", (data) => {
    // console.log(`stdout: ${data}`);
  });

  child_process.stderr.on("data", (data) => {
    // console.error(`stderr: ${data}`);
  });

  child_process.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

process.on("message", (message) => {
  console.log("startProcess", message.camera_name, message.rtsp_url);
  //   console.log("previous CHild: ", child_process);
  rtspToHls(message);
});
