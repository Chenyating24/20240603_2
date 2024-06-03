/* MoveNet Skeleton - Steve's Makerspace (most of this code is from TensorFlow)

MoveNet is developed by TensorFlow:
https://www.tensorflow.org/hub/tutorials/movenet
*/

let video, detector; // 定義變數 video 和 detector，用來儲存影片和偵測器
let poses = []; // 定義變數 poses，儲存偵測到的姿勢數據
let bikeImg; // 定義變數 bikeImg，儲存自行車圖片
let catImg; // 定義變數 catImg，儲存貓咪圖片

function preload() {
  bikeImg = loadImage("bike.gif"); // 預載入自行車圖片
  catImg = loadImage("cat.gif"); // 預載入貓咪圖片
}

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING, // 設定偵測器配置，使用 MULTIPOSE_LIGHTNING 模型
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  ); // 創建 MoveNet 偵測器
}

async function videoReady() {
  console.log("video ready"); // 當影片準備好時在控制台輸出訊息
  await getPoses(); // 開始偵測姿勢
}

async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt, {
      maxPoses: 2,
      //flipHorizontal: true,
    }); // 使用偵測器估計影片中的姿勢
  }
  requestAnimationFrame(getPoses); // 持續呼叫 getPoses 函數以實時更新姿勢
}

async function setup() {
  createCanvas(640, 480); // 創建畫布，尺寸為 640x480
  video = createCapture(VIDEO, videoReady); // 捕捉影片並在影片準備好時呼叫 videoReady 函數
  video.size(width, height); // 設定影片的尺寸
  video.hide(); // 隱藏影片元素，只顯示畫布上的影像
  await init(); // 初始化偵測器

  stroke(255); // 設定畫筆顏色為白色
  strokeWeight(5); // 設定畫筆粗細為 5
}

function draw() {
  image(video, 0, 0); // 將影片影像繪製到畫布上
  drawSkeleton(); // 繪製骨架
  // flip horizontal
  let cam = get(); // 獲取當前畫布影像
  translate(cam.width, 0); // 移動畫布原點到右邊
  scale(-1, 1); // 水平翻轉畫布
  image(cam, 0, 0); // 將翻轉後的影像繪製到畫布上
}

function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i]; // 獲取當前姿勢數據

    // 找到右眼和左眼的位置
    let rightEye = pose.keypoints[2]; // 獲取右眼的位置
    let leftEye = pose.keypoints[1]; // 獲取左眼的位置

    if (rightEye.score > 0.1 && leftEye.score > 0.1) {
      // 計算兩眼之間的中點位置
      let middleX = (rightEye.x + leftEye.x) / 2;
      let middleY = (rightEye.y + leftEye.y) / 2;

      // 計算貓咪移動的方向
      let dx = cos(frameCount * 0.05) * 50;
      let direction = dx > 0 ? 1 : -1; // 如果 dx 大於 0，則 direction 為 1；否則為 -1

      push();
      imageMode(CENTER); // 設定圖像模式為中心對齊
      if (direction === 1) {
        // 如果貓咪向右移動，不翻轉圖片
        image(catImg, middleX + dx, middleY, 50, 50);
      } else {
        // 如果貓咪向左移動，水平翻轉圖片
        translate(middleX + dx, middleY);
        scale(-1,1); // 水平翻轉圖片
        image(catImg, 0, 0, 50, 50);
      }
      pop();
    }

    // 在自行車圖片顯示在右肩上
    // 找到右肩和左肩的位置
    let rightShoulder = pose.keypoints[6]; // 獲取右肩的位置
    let leftShoulder = pose.keypoints[5]; // 獲取左肩的位置

    if (rightShoulder.score > 0.1 && leftShoulder.score > 0.1) {
      // 計算肩膀之間的中點位置
      let middleX = (rightShoulder.x + leftShoulder.x) / 2;
      let middleY = (rightShoulder.y + leftShoulder.y) / 2;

      // 計算自行車移動的方向和幅度
      let dx = cos(frameCount * 0.05) * 100; // 調整此處的移動幅度
      let direction = dx > 0 ? 1 : -1; // 如果 dx 大於 0，則 direction 為 1；否則為 -1

      push();
      imageMode(CENTER); // 設定圖像模式為中心對齊
      if (direction === 1) {
        // 如果自行車向左移動，不翻轉圖片
        image(bikeImg, middleX + dx, middleY - 75, 75, 75);
      } else {
        // 如果自行車向右移動，水平翻轉圖片
        translate(middleX + dx, middleY - 75);
        scale(-1, 1); // 水平翻轉圖片
        image(bikeImg, 0, 0, 75, 75);
      }
      pop();

      let pose = poses[i];
    let nose = pose.keypoints[0];
    if (nose.score > 0.1) {
      push();
      textSize(40);
      fill(255, 0, 0);
      textAlign(CENTER, CENTER);
      scale(-1, 1);
      text("408730413,陳雅婷", -nose.x, nose.y - 200);
      pop();

    }
    }
  }
}