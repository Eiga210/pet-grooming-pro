<template>
  <div class="grooming-wrapper">
    <!-- 第一區塊：幻燈片 -->
    <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="@/assets/imags/petgrooming.png" class="d-block w-100" alt="溫馨美容空間" />
          <div class="carousel-caption d-none d-md-block animate__animated animate__fadeInUp">
     
          </div>
        </div>
        <div class="carousel-item">
          <img src="@/assets/imags/petgrooming.png" class="d-block w-100" alt="專業服務" />
          <div class="carousel-caption d-none d-md-block animate__animated animate__fadeInUp">
            
          </div>
        </div>
        <!-- 可再加入更多 -->
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>

    <div class="text-center mb-4 text-dark ">
      <h2>寵物美容</h2>
      <p class="lead">爪娃專業洗護你家毛小孩！</p>
      <h5>專業美容｜舒適環境｜五星級服務</h5>
    </div>

    <div class="row justify-content-center g-3 mb-4">
      <div
        class="col-6 col-md-3"
        v-for="(item, index) in services"
        :key="index"
      >
        <div
          class="service-btn"
          :class="{ active: selectedService?.title === item.title }"
          @mouseenter="selectedService = item"
        >
          <div class="icon">🐾</div>
          <div class="title">{{ item.title }}</div>
        </div>
      </div>
    </div>
    <div class="row align-items-center g-4 section-spacing">
      <div class="row align-items-center g-4">
        <div class=" col-md-6 ">
          <div class="image-box">
           <img
            v-if="selectedService"
            :src="selectedService.img"
            alt="美容圖片"
            class="img-fluid shadow"
            />
            <div
            v-else
            id="carouselExampleFade"
            class="carousel slide carousel-fade"
            data-bs-ride="carousel"
           >
            <div class="carousel-inner shadow">
              <div
                class="carousel-item"
                v-for="(item, index) in services"
                :class="{ active: index === 0 }"
                :key="'slide-' + index"
              >
                <img :src="item.img" class="d-block w-100" alt="服務輪播" />
              </div>
            </div>
          </div>
        </div>
      </div>
       

      <!-- 說明區塊 -->
  <div class="col-md-6">
    <div class="info-card position-relative rounded overflow-hidden text-white">
      <img src="@/assets/imags/talk.png" alt="背景圖" class="bg-image" />

       <div class="overlay-content">
      <h4 v-if="selectedService" class="fw-bold">
        {{ selectedService.title }}
      </h4>
      <p v-if="selectedService">{{ selectedService.description }}</p>
      <p v-else class="text-white-50">爪娃專業洗護你家毛小孩！</p>
    </div>
  </div>
  </div>
</div>
<!-- 第三區塊：介紹環境 -->
<section class="bg-light py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <img src="@/assets/imags/space.png"  class="img-fluid rounded shadow animate__animated animate__zoomIn space-img" alt="環境介紹" />
          </div>
          <div class="col-md-6">
            <h3 class="fw-bold">舒適明亮的環境</h3>
            <p class="text-muted">我們打造安心、放鬆的美容空間，讓您身心都煥然一新 🌿</p>
          </div>
        </div>
      </div>
    </section>
   
<!-- 店家資訊區塊 -->
<div class="store-info-container bg-white shadow-sm rounded p-4 mt-5">
  <h4 class="text-center text-success fw-bold mb-4">📍 店家資訊</h4>
  <ul class="list-unstyled store-info-list">
    <li><i class="bi bi-geo-alt-fill text-danger me-2"></i><strong>地址：</strong>桃園市中壢區新生路二段421號</li>
    <li><i class="bi bi-telephone-fill text-primary me-2"></i><strong>電話：</strong>(03) 453-3013</li>
    <li><i class="bi bi-clock-fill text-warning me-2"></i><strong>營業時間：</strong>週一至週日 10:00 - 22:00</li>
    <li><i class="bi bi-chat-dots-fill text-success me-2"></i><strong>LINE：</strong>@pawcare</li>
    <li><i class="bi bi-bus-front-fill text-info me-2"></i><strong>交通：</strong>中壢火車站 → 中壢客運17路(中壢– 高鐵青埔站)</li>
  </ul>
</div>

 <!-- 第四區塊：左右交錯介紹特色 -->
 <section class="py-5">
      <div class="container">
        <div class="feature-card d-md-flex align-items-center">
          <div class="col-md-6 px-4 py-3">
            <h4 class="fw-bold">專業美容師團隊</h4>
            <p>每位美容師皆通過專業訓練與認證</p>
            <p>持續進修，掌握最新寵物美容趨勢</p>
            <p>用愛與耐心，細心對待每一位毛孩</p>
          </div>
          <div class="col-md-6">
            <img src="@/assets/imags/t01.png" class="img-fluid animate-img" />
          </div>
        </div>
        <div class="row align-items-center flex-md-row-reverse">
          <div class="col-md-6">
            <h4 class="fw-bold">安心舒適的美容環境</h4>
            <p>犬貓分區，避免交叉緊張</p>
            <p>每次服務後皆徹底消毒清潔</p>
            <p>打造讓毛孩放鬆的氛圍</p>
          </div>
          <div class="col-md-6">
            <img src="@/assets/imags/t02.png" class="img-fluid animate-img" />
          </div>
        </div>
        <div class="feature-card d-md-flex align-items-center">
          <div class="col-md-6 px-4 py-3">
            <h4 class="fw-bold">預約制・專屬時段</h4>
            <p>一對一專屬時段，避免等待與趕場</p>
            <p>不超接，確保美容品質與安全</p>
            <p>細心觀察毛孩狀況，主動回報分享</p>       
          </div>
          <div class="col-md-6">
            <img src="@/assets/imags/t03.png" class="img-fluid animate-img" />
          </div>
        </div>
        <div class="row align-items-center flex-md-row-reverse">
          <div class="col-md-6">
            <h4 class="fw-bold">用心呵護的毛小孩</h4>
            <p>開放陪同美容，安心陪伴不緊張</p>
            <p>依照毛孩膚質與需求量身打造護理方式</p>
          </div>
          <div class="col-md-6">
            <img src="@/assets/imags/t04.png" class="img-fluid animate-img" />
          </div>
        </div>
      </div>
    </section>
    </div>
<check/>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import check from '@/components/ReserveCheck.vue'
const router = useRouter();
const selectedService = ref(null);

const services = [
  {
    id: 1,
    title: "基礎洗護",
    img: new URL(
      "@/assets/imags/basicgrooming02.png",
      import.meta.url
    ).href,
    description:
      "此服務使用溫和無刺激的洗劑，專為寵物肌膚設計，能夠有效清潔寵物的皮毛。服務內容包含洗澡、吹乾，並進行簡單梳理，幫助保持毛發的乾淨與順滑。這是最基本的洗護方案，適合需要常規清潔保養的毛孩。",
  },
  {
    id: 2,
    title: "基礎洗護含美容修剪",
    img: new URL(
      "@/assets/imags/basicgrooming01.png",
      import.meta.url
    ).href,
    description:
      "在基礎洗護的基礎上，我們提供額外的美容修剪服務，讓您的毛孩不僅乾淨，還能保持整齊美觀。此服務包含基本剪毛、腳底清理、修整臉部毛髮等，特別適合長毛或需要定期修剪的毛孩，讓牠們看起來更加精緻，並保持清爽。 ",
  },
  {
    id: 3,
    title: "專業洗護",
    img: new URL("@assets/imags/grooming02.png", import.meta.url)
      .href,
    description:
      "專業洗護使用高品質的洗劑和深層護理配方，能夠提供寵物毛發與皮膚更為深入的清潔與保養。這項服務不僅包括全身洗澡，還包含全身修剪與造型設計，讓毛孩更顯美麗。無論是短毛或長毛犬貓，都能從專業洗護中獲得舒適的洗護體驗，毛髮質地會變得更加柔順光滑。",
  },
  {
    id: 4,
    title: "專業洗護含美容修剪",
    img: new URL("@/assets/imags/grooming01.png", import.meta.url)
      .href,
    description:
      "此服務將專業洗護和美容修剪結合，讓您的毛孩在徹底清潔的同時，還能獲得美容修剪服務。我們將使用精油按摩與護毛護膚的技術，讓毛孩在洗護過程中放鬆，舒緩壓力，並促進毛發的健康生長。此方案特別適合需要全方位護理的毛孩，讓牠們不僅外觀靚麗，還能獲得身心的放鬆。",
  },
];


</script>

<style scoped>
.carousel-img {
  height: 50px;
  object-fit: cover;
}
h5 { font-size: 1.25rem; color: #388e3c; }
.grooming-wrapper {
  background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%);
  padding: 3rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(102, 187, 106, 0.2);
}

.service-btn {
  background-color: #fff;
  border: 2px solid #66bb6a;
  border-radius: 1rem;
  text-align: center;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.service-btn:hover {
  background-color: #e8f5e9;
  transform: translateY(-4px);
}

.service-btn.active {
  background-color: #c8e6c9;
  box-shadow: 0 0 0 4px #a5d6a7;
}

.service-btn .icon {
  font-size: 2rem;
}

.service-btn .title {
  font-weight: bold;
  margin-top: 0.5rem;
  font-size: 0.95rem;
}
.logo-img {
  height: 250px;
  width: auto;
  object-fit: contain;
}
.image-box {
  width: 500px;
  height: 500px;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
  border-radius: 50%;
}

.carousel-inner img {
  object-fit: cover;
  height: 100%;
  width: 100%;
  object-position: center;
}

.info-card {
  background-color: #fff;
  padding: 2rem;
  border: 1px solid #c8e6c9;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.2);
  height: 320px;
}
.custom-list {
  padding-left: 1rem;
  margin-bottom: 0;
  list-style-type: disc;
}

.custom-list li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

h5 {
  font-size: 1.1rem;
}

.row {
  flex-wrap: wrap; 
}
.feature-box {
    border: 2px dashed #28a745; 
    border-radius: 10px;
    padding: 20px;
    height: 100%;
    background-color: #fdfdfd; 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    transition: transform 0.3s ease;
  }

  .feature-box:hover {
    transform: translateY(-4px);
  }

  .custom-list {
    padding-left: 1.2rem;
  }

  .custom-list li {
    margin-bottom: 0.5rem;
  }

  .store-info-container {
  display: flex;
  position: relative;
  background-color: #ffffff; 
  padding-top: 80px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  max-width: 650px;
  margin: 0 auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.store-info-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.store-info-container h4 {
  font-size: 1.6rem;
  font-weight: 600;
  color: #007b3e;
  text-transform: uppercase;
}

.store-info ul li {
  font-size: 1.1rem;
  margin-bottom: 12px;
  color: #555;
  line-height: 1.8;
}

.store-info ul li strong {
  color: #007b3e;
}

.store-info ul {
  padding-left: 20px;
}
.animate-img {
  max-height: 300px;
  object-fit: contain;
  background: transparent; 
  border: none;           
  box-shadow: none;        
}

.feature-card {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.info-card {
  position: relative;
  height: 480px;
  width: 100%;             
  max-width: 600px;       
  background: transparent;
  border: none;
  box-shadow: none;
  overflow: hidden;
  margin: auto;            
  font-family: 'Noto Sans TC', sans-serif;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 90%;
  height: auto; 
  object-fit: cover;
  z-index: 0; 
}

.overlay-content {
  position: relative;
  width: 85%;
  z-index: 1; 
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
}

.overlay-content h4 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.overlay-content p {
  font-size: 1.125rem;
  line-height: 1.8;
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.9);
}

img.space-img {
  max-width: 100%;        
  width: 100%;            
  height: auto;           
  max-height: 400px;      
  object-fit: cover;      
  border-radius: 0.5rem; 
}

</style>
