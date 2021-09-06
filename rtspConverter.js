var mysql = require("mysql");
const { fork } = require("child_process");
var cluster = require("cluster");

var db_con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Raveen@2001",
  database: "anpr",
});

const convertToHLS = (rows) => {
  const cameras = rows;
  // console.log(output[0].camera_name);
  cameras.forEach((cam) => {
    const child = fork("./rtspToHls.js");
    child.send(cam);
  });
};

db_con.connect(async (err) => {
  if (err) {
    console.log("Database Connection Failed !!!", err);
    return;
  }

  console.log("Connected to Database");

  let query = "select camera_name, rtsp_url from anpr_cameras;";
  db_con.query(query, (err, rows) => {
    if (err) {
      console.log("internal error", err);
      return;
    }
    convertToHLS(rows);
    db_con.end();
  });
});

// const urls = new Map();

// urls.set(
//   "stream1",
//   "rtsp://freja.hiof.no:1935/rtplive/_definst_/hessdalen02.stream"
// );
// urls.set(
//   "stream2",
//   "rtsp://freja.hiof.no:1935/rtplive/_definst_/hessdalen03.stream"
// );

// let cmd = [];
// const child_process = require("child_process");

// urls.forEach((key, value) => {
//   console.log("Key", key, "value: ", value);
//   // cmd =
//   //   `./ffmpeg.exe -i ${key} -fflags flush_packets -max_delay 5 -flags -global_header -hls_time 5 -hls_list_size 3 -vcodec copy -y ip_cam_videos/${value}.m3u8`.split(
//   //     " "
//   //   );
//   const cmd =
//     `./ffmpeg -i rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov -c:v copy -c:a copy -bsf:v h264_mp4toannexb -maxrate 500k -f matroska -`.split(
//       " "
//     );

//   console.log(cmd);
//   child_process.spawn(cmd[0], cmd.splice(1), {
//     stdio: ["ignore", "pipe", process.stderr],
//   });
// });
