// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 文件拖拽上传
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#0071e3';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#d2d2d7';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#d2d2d7';
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
        processImage(file);
    }
});

// 点击上传
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        processImage(file);
    }
});

// 处理图片
function processImage(file) {
    // 显示原图大小
    originalSize.textContent = formatFileSize(file.size);

    // 读取并显示原图
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        compressImage(e.target.result, qualitySlider.value / 100);
    };
    reader.readAsDataURL(file);

    // 显示预览区域
    previewArea.style.display = 'block';
    uploadArea.style.display = 'none';
}

// 压缩图片
function compressImage(base64, quality) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // 压缩图片
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        compressedImage.src = compressedBase64;

        // 计算压缩后文件大小
        const compressedBytes = atob(compressedBase64.split(',')[1]).length;
        compressedSize.textContent = formatFileSize(compressedBytes);
    };
    img.src = base64;
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 质量滑块事件
qualitySlider.addEventListener('input', (e) => {
    const quality = e.target.value;
    qualityValue.textContent = quality + '%';
    compressImage(originalImage.src, quality / 100);
});

// 下载按钮事件
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'compressed_image.jpg';
    link.href = compressedImage.src;
    link.click();
}); 