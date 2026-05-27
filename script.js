/*
  관리자용 상품 교체 가이드
  실제 쿠팡 파트너스 상품을 넣는 위치는 아래 REAL_PRODUCTS 배열입니다.

  여러 개를 추가할 때는 REAL_PRODUCTS 배열에 아래 형식의 객체를 복사해서 붙여넣으세요.
  {
    id: 10004, // 기존 id와 겹치지 않게 증가
    name: "실제 쿠팡 상품명",
    category: "생활템",
    price: 30000, // 추천 필터용 숫자. 정확하지 않으면 예산 상한값으로 입력
    priceText: "쿠팡 페이지에서 확인", // 확정 가격을 모르면 이 문구 사용
    image: "https://...", // 이미지 URL이 없으면 빈 문자열
    affiliateUrl: "https://link.coupang.com/a/...",
    isRealAffiliateLink: true,
    comment: "랜덤 추천 카드에 보일 짧은 멘트",
    impulseScore: 82
  }

  주의:
  - isRealAffiliateLink가 true이고 임시 링크가 아닌 상품만 "쿠팡에서 보기"가 활성화됩니다.
  - 쿠팡 Open API 키, Secret Key, Access Key 같은 비밀 값은 절대 프론트엔드 코드에 넣지 마세요.
  - API 자동화는 나중에 서버에서 처리하고, GitHub Pages에는 비밀 값을 올리지 마세요.
*/

const PARTNERS_DISCLOSURE = "이 사이트는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.";
const STORAGE_KEYS = {
  recent: "randomCoupang_recentIds",
  liked: "randomCoupang_likedIds"
};

// ============================================================
// REAL_PRODUCTS: 실제 쿠팡 파트너스 링크 상품 입력 영역
// - 실제 링크가 있고 isRealAffiliateLink가 true인 상품은 더미 상품보다 우선 추천됩니다.
// - 상품이 여러 개면 입력 금액 이하의 실제 링크 상품 중에서 랜덤 추천됩니다.
// - 첫 번째 상품의 name은 실제 쿠팡 상품명을 받으면 그대로 교체하세요.
//   예: name: "브랜드명 상품명 옵션명"
// - 정확한 가격을 모르면 priceText: "쿠팡 페이지에서 확인"처럼 적어도 됩니다.
// ============================================================
const REAL_PRODUCTS = [
  {
    id: 10001,
    name: "생활 편의 추천 아이템",
    category: "생활템",
    price: 30000,
    priceText: "30,000원 이하",
    image: "",
    affiliateUrl: "https://link.coupang.com/a/d397AWV7w4",
    isRealAffiliateLink: true,
    comment: "금액 안에서 가볍게 뽑아보기 좋은 랜덤 추천템입니다.",
    impulseScore: 82
  },
  {
    id: 10002,
    name: "실제 링크 테스트 상품 2",
    category: "파트너스 테스트",
    price: 24900,
    priceText: "24,900원",
    image: "🎯",
    affiliateUrl: "PASTE_COUPANG_PARTNERS_LINK_HERE",
    isRealAffiliateLink: false,
    comment: "심사용 스크린샷에서 실제 링크 활성 상태를 보여주기 좋은 예시 칸입니다.",
    impulseScore: 86
  },
  {
    id: 10003,
    name: "실제 링크 테스트 상품 3",
    category: "파트너스 테스트",
    price: 39900,
    priceText: "39,900원",
    image: "✨",
    affiliateUrl: "PASTE_COUPANG_PARTNERS_LINK_HERE",
    isRealAffiliateLink: false,
    comment: "상품명, 가격, 이미지 URL까지 실제 운영 상품 정보로 교체해 사용하세요.",
    impulseScore: 78
  }
];

// SAMPLE_PRODUCTS: 실제 링크 상품이 없거나 부족할 때 보여주는 정적 더미 추천 풀입니다.
const SAMPLE_PRODUCTS = [
  { id: 1, name: "접이식 미니 빨래바구니", category: "자취템", price: 7900, priceText: "7,900원", image: "🧺", affiliateUrl: "https://www.coupang.com/placeholder/1?tag=replace-me", isRealAffiliateLink: false, comment: "방 한쪽이 갑자기 어른의 공간처럼 보이는 마법.", impulseScore: 73 },
  { id: 2, name: "침대 옆 컵홀더 트레이", category: "자취템", price: 12900, priceText: "12,900원", image: "🥤", affiliateUrl: "https://www.coupang.com/placeholder/2?tag=replace-me", isRealAffiliateLink: false, comment: "눕자마자 물컵 찾는 사람을 위한 작은 복지.", impulseScore: 82 },
  { id: 3, name: "무타공 멀티탭 정리함", category: "자취템", price: 15900, priceText: "15,900원", image: "🔌", affiliateUrl: "https://www.coupang.com/placeholder/3?tag=replace-me", isRealAffiliateLink: false, comment: "선이 사라지면 마음의 주름도 살짝 펴집니다.", impulseScore: 68 },
  { id: 4, name: "원룸용 슬림 행거", category: "자취템", price: 29900, priceText: "29,900원", image: "👕", affiliateUrl: "https://www.coupang.com/placeholder/4?tag=replace-me", isRealAffiliateLink: false, comment: "의자 위 옷탑에게 드디어 퇴거 명령.", impulseScore: 76 },
  { id: 5, name: "전자레인지 라면 용기", category: "자취템", price: 8900, priceText: "8,900원", image: "🍜", affiliateUrl: "https://www.coupang.com/placeholder/5?tag=replace-me", isRealAffiliateLink: false, comment: "야식 루틴이 두 단계쯤 편해지는 아이템.", impulseScore: 87 },
  { id: 6, name: "방문 걸이 수납 포켓", category: "자취템", price: 11900, priceText: "11,900원", image: "🚪", affiliateUrl: "https://www.coupang.com/placeholder/6?tag=replace-me", isRealAffiliateLink: false, comment: "문 뒤에 숨어 있던 수납력이 깨어납니다.", impulseScore: 70 },
  { id: 7, name: "실리콘 음식 덮개 세트", category: "자취템", price: 9900, priceText: "9,900원", image: "🥣", affiliateUrl: "https://www.coupang.com/placeholder/7?tag=replace-me", isRealAffiliateLink: false, comment: "랩 찾다가 귀찮아지는 미래를 미리 차단.", impulseScore: 65 },
  { id: 8, name: "미니 제습제 12개입", category: "자취템", price: 13900, priceText: "13,900원", image: "💧", affiliateUrl: "https://www.coupang.com/placeholder/8?tag=replace-me", isRealAffiliateLink: false, comment: "옷장 속 눅눅함에게 보내는 정중한 작별 인사.", impulseScore: 62 },
  { id: 9, name: "책상 밑 케이블 바스켓", category: "책상템", price: 16900, priceText: "16,900원", image: "🧵", affiliateUrl: "https://www.coupang.com/placeholder/9?tag=replace-me", isRealAffiliateLink: false, comment: "책상 아래 혼돈을 한 번에 숨기는 깔끔한 척 장비.", impulseScore: 71 },
  { id: 10, name: "저소음 무선 마우스", category: "책상템", price: 18900, priceText: "18,900원", image: "🖱️", affiliateUrl: "https://www.coupang.com/placeholder/10?tag=replace-me", isRealAffiliateLink: false, comment: "딸깍 소리 없이도 일하는 척은 가능해요.", impulseScore: 79 },
  { id: 11, name: "손목 받침대 젤 패드", category: "책상템", price: 6900, priceText: "6,900원", image: "🫳", affiliateUrl: "https://www.coupang.com/placeholder/11?tag=replace-me", isRealAffiliateLink: false, comment: "손목에게 오늘의 작은 휴가를.", impulseScore: 67 },
  { id: 12, name: "모니터 메모 보드", category: "책상템", price: 9900, priceText: "9,900원", image: "📝", affiliateUrl: "https://www.coupang.com/placeholder/12?tag=replace-me", isRealAffiliateLink: false, comment: "까먹을 일을 예쁘게 까먹지 않게 해줍니다.", impulseScore: 64 },
  { id: 13, name: "USB 허브 4포트", category: "책상템", price: 14900, priceText: "14,900원", image: "🔗", affiliateUrl: "https://www.coupang.com/placeholder/13?tag=replace-me", isRealAffiliateLink: false, comment: "포트 부족이라는 현대인의 사소한 분노 해결.", impulseScore: 74 },
  { id: 14, name: "각도 조절 노트북 받침대", category: "책상템", price: 24900, priceText: "24,900원", image: "💻", affiliateUrl: "https://www.coupang.com/placeholder/14?tag=replace-me", isRealAffiliateLink: false, comment: "거북목에게 오늘만큼은 휴전 제안.", impulseScore: 84 },
  { id: 15, name: "책상 미니 청소기", category: "책상템", price: 11900, priceText: "11,900원", image: "🧹", affiliateUrl: "https://www.coupang.com/placeholder/15?tag=replace-me", isRealAffiliateLink: false, comment: "키보드 과자 부스러기를 조용히 체포합니다.", impulseScore: 78 },
  { id: 16, name: "데스크 매트 대형", category: "책상템", price: 21900, priceText: "21,900원", image: "🟦", affiliateUrl: "https://www.coupang.com/placeholder/16?tag=replace-me", isRealAffiliateLink: false, comment: "깔기만 해도 책상이 갑자기 작업실 분위기.", impulseScore: 81 },
  { id: 17, name: "휴대용 보풀 제거기", category: "생활템", price: 13900, priceText: "13,900원", image: "🧶", affiliateUrl: "https://www.coupang.com/placeholder/17?tag=replace-me", isRealAffiliateLink: false, comment: "니트가 다시 사회생활 가능한 상태로 복귀.", impulseScore: 75 },
  { id: 18, name: "현관 마스크 보관함", category: "생활템", price: 8900, priceText: "8,900원", image: "😷", affiliateUrl: "https://www.coupang.com/placeholder/18?tag=replace-me", isRealAffiliateLink: false, comment: "나가기 직전 허둥지둥 찾는 시간을 줄여요.", impulseScore: 57 },
  { id: 19, name: "자동 우산 캡슐 케이스", category: "생활템", price: 10900, priceText: "10,900원", image: "☂️", affiliateUrl: "https://www.coupang.com/placeholder/19?tag=replace-me", isRealAffiliateLink: false, comment: "젖은 우산의 민폐력을 살짝 봉인.", impulseScore: 66 },
  { id: 20, name: "접착식 리모컨 홀더", category: "생활템", price: 5900, priceText: "5,900원", image: "📺", affiliateUrl: "https://www.coupang.com/placeholder/20?tag=replace-me", isRealAffiliateLink: false, comment: "리모컨 실종 사건 수사 종료.", impulseScore: 61 },
  { id: 21, name: "옷장 방향제 세트", category: "생활템", price: 9900, priceText: "9,900원", image: "🌸", affiliateUrl: "https://www.coupang.com/placeholder/21?tag=replace-me", isRealAffiliateLink: false, comment: "문 열 때마다 약간 성실한 사람 느낌.", impulseScore: 69 },
  { id: 22, name: "휴대용 먼지 제거 롤러", category: "생활템", price: 4900, priceText: "4,900원", image: "🧻", affiliateUrl: "https://www.coupang.com/placeholder/22?tag=replace-me", isRealAffiliateLink: false, comment: "검은 옷 입는 날의 필수 생존템.", impulseScore: 72 },
  { id: 23, name: "수납형 티슈 케이스", category: "생활템", price: 12900, priceText: "12,900원", image: "📦", affiliateUrl: "https://www.coupang.com/placeholder/23?tag=replace-me", isRealAffiliateLink: false, comment: "티슈 위에 또 뭘 올려두고 싶은 사람에게.", impulseScore: 58 },
  { id: 24, name: "자석식 현관 키홀더", category: "생활템", price: 11900, priceText: "11,900원", image: "🔑", affiliateUrl: "https://www.coupang.com/placeholder/24?tag=replace-me", isRealAffiliateLink: false, comment: "열쇠 찾아 삼만 리를 끝내는 작은 벽 장식.", impulseScore: 70 },
  { id: 25, name: "초코 웨하스 대용량", category: "간식", price: 9900, priceText: "9,900원", image: "🍫", affiliateUrl: "https://www.coupang.com/placeholder/25?tag=replace-me", isRealAffiliateLink: false, comment: "하나만 먹으려 했다는 말은 늘 아름다운 거짓말.", impulseScore: 91 },
  { id: 26, name: "매콤한 컵떡볶이 세트", category: "간식", price: 15900, priceText: "15,900원", image: "🌶️", affiliateUrl: "https://www.coupang.com/placeholder/26?tag=replace-me", isRealAffiliateLink: false, comment: "퇴근 후 마음을 빨갛게 달래주는 맛.", impulseScore: 89 },
  { id: 27, name: "구운 아몬드 스낵팩", category: "간식", price: 12900, priceText: "12,900원", image: "🥜", affiliateUrl: "https://www.coupang.com/placeholder/27?tag=replace-me", isRealAffiliateLink: false, comment: "건강한 척하면서 계속 집어먹기 좋습니다.", impulseScore: 80 },
  { id: 28, name: "젤리 믹스 박스", category: "간식", price: 14900, priceText: "14,900원", image: "🍬", affiliateUrl: "https://www.coupang.com/placeholder/28?tag=replace-me", isRealAffiliateLink: false, comment: "서랍 속 기분 전환 버튼을 대량 충전.", impulseScore: 88 },
  { id: 29, name: "미니 약과 한입팩", category: "간식", price: 11900, priceText: "11,900원", image: "🍯", affiliateUrl: "https://www.coupang.com/placeholder/29?tag=replace-me", isRealAffiliateLink: false, comment: "커피 옆에 있으면 갑자기 전통 있는 오후.", impulseScore: 86 },
  { id: 30, name: "단백질 쿠키 샘플러", category: "간식", price: 19900, priceText: "19,900원", image: "🍪", affiliateUrl: "https://www.coupang.com/placeholder/30?tag=replace-me", isRealAffiliateLink: false, comment: "운동템인지 간식인지 애매해서 더 좋음.", impulseScore: 77 },
  { id: 31, name: "컵스프 10개입", category: "간식", price: 8900, priceText: "8,900원", image: "🥣", affiliateUrl: "https://www.coupang.com/placeholder/31?tag=replace-me", isRealAffiliateLink: false, comment: "밤 11시의 허기를 과하지 않게 달래는 선택.", impulseScore: 74 },
  { id: 32, name: "과일칩 버라이어티팩", category: "간식", price: 17900, priceText: "17,900원", image: "🍎", affiliateUrl: "https://www.coupang.com/placeholder/32?tag=replace-me", isRealAffiliateLink: false, comment: "바삭한데 과일이라 괜찮다는 자기 설득 가능.", impulseScore: 83 },
  { id: 33, name: "블루투스 미니 스피커", category: "전자기기", price: 29900, priceText: "29,900원", image: "🔊", affiliateUrl: "https://www.coupang.com/placeholder/33?tag=replace-me", isRealAffiliateLink: false, comment: "방 분위기를 버튼 하나로 살짝 업그레이드.", impulseScore: 85 },
  { id: 34, name: "고속 충전 케이블 2개", category: "전자기기", price: 9900, priceText: "9,900원", image: "⚡", affiliateUrl: "https://www.coupang.com/placeholder/34?tag=replace-me", isRealAffiliateLink: false, comment: "충전선은 늘 사라지니까 미리 사도 합리적입니다.", impulseScore: 78 },
  { id: 35, name: "무선 충전 패드", category: "전자기기", price: 16900, priceText: "16,900원", image: "🔋", affiliateUrl: "https://www.coupang.com/placeholder/35?tag=replace-me", isRealAffiliateLink: false, comment: "올려두기만 하면 되는 게 이렇게 마음 편할 일.", impulseScore: 82 },
  { id: 36, name: "스마트폰 삼각대", category: "전자기기", price: 13900, priceText: "13,900원", image: "📱", affiliateUrl: "https://www.coupang.com/placeholder/36?tag=replace-me", isRealAffiliateLink: false, comment: "혼자 찍어도 꽤 계획적인 사람처럼 보입니다.", impulseScore: 73 },
  { id: 37, name: "C타입 멀티 어댑터", category: "전자기기", price: 24900, priceText: "24,900원", image: "🧩", affiliateUrl: "https://www.coupang.com/placeholder/37?tag=replace-me", isRealAffiliateLink: false, comment: "노트북이 갑자기 확장성을 되찾는 순간.", impulseScore: 79 },
  { id: 38, name: "미니 LED 무드등", category: "전자기기", price: 11900, priceText: "11,900원", image: "💡", affiliateUrl: "https://www.coupang.com/placeholder/38?tag=replace-me", isRealAffiliateLink: false, comment: "불 끄고 켜면 방이 조금 더 다정해져요.", impulseScore: 87 },
  { id: 39, name: "태블릿 거치대", category: "전자기기", price: 18900, priceText: "18,900원", image: "📲", affiliateUrl: "https://www.coupang.com/placeholder/39?tag=replace-me", isRealAffiliateLink: false, comment: "영상 볼 때 손을 해방시키는 작은 혁명.", impulseScore: 84 },
  { id: 40, name: "키보드 청소 젤", category: "전자기기", price: 6900, priceText: "6,900원", image: "⌨️", affiliateUrl: "https://www.coupang.com/placeholder/40?tag=replace-me", isRealAffiliateLink: false, comment: "틈새 먼지가 딱 들키는 재미가 있습니다.", impulseScore: 72 },
  { id: 41, name: "라텍스 스트레칭 밴드", category: "운동템", price: 7900, priceText: "7,900원", image: "🏋️", affiliateUrl: "https://www.coupang.com/placeholder/41?tag=replace-me", isRealAffiliateLink: false, comment: "운동 결심의 진입장벽을 살짝 낮춰주는 밴드.", impulseScore: 76 },
  { id: 42, name: "폼롤러 기본형", category: "운동템", price: 15900, priceText: "15,900원", image: "🧘", affiliateUrl: "https://www.coupang.com/placeholder/42?tag=replace-me", isRealAffiliateLink: false, comment: "아픈데 시원한 그 이상한 만족감을 집으로.", impulseScore: 81 },
  { id: 43, name: "악력기 카운터형", category: "운동템", price: 8900, priceText: "8,900원", image: "✊", affiliateUrl: "https://www.coupang.com/placeholder/43?tag=replace-me", isRealAffiliateLink: false, comment: "회의 들으면서 몰래 강해질 수 있습니다.", impulseScore: 70 },
  { id: 44, name: "요가매트 스트랩", category: "운동템", price: 11900, priceText: "11,900원", image: "🟩", affiliateUrl: "https://www.coupang.com/placeholder/44?tag=replace-me", isRealAffiliateLink: false, comment: "운동하러 가는 사람처럼 보이는 장비력.", impulseScore: 63 },
  { id: 45, name: "스포츠 물병 1L", category: "운동템", price: 9900, priceText: "9,900원", image: "💦", affiliateUrl: "https://www.coupang.com/placeholder/45?tag=replace-me", isRealAffiliateLink: false, comment: "물을 많이 마시는 사람은 왠지 멋있으니까요.", impulseScore: 74 },
  { id: 46, name: "발목 줄넘기 카운터", category: "운동템", price: 13900, priceText: "13,900원", image: "🪢", affiliateUrl: "https://www.coupang.com/placeholder/46?tag=replace-me", isRealAffiliateLink: false, comment: "공간 없이도 땀은 충분히 날 수 있습니다.", impulseScore: 67 },
  { id: 47, name: "미니 마사지볼 세트", category: "운동템", price: 10900, priceText: "10,900원", image: "🔴", affiliateUrl: "https://www.coupang.com/placeholder/47?tag=replace-me", isRealAffiliateLink: false, comment: "발바닥이 말없이 박수치는 시원함.", impulseScore: 82 },
  { id: 48, name: "스쿼트 밴드 3종", category: "운동템", price: 12900, priceText: "12,900원", image: "🍑", affiliateUrl: "https://www.coupang.com/placeholder/48?tag=replace-me", isRealAffiliateLink: false, comment: "하체 루틴에 귀여운 고통을 추가합니다.", impulseScore: 79 },
  { id: 49, name: "핸드크림 선물 세트", category: "선물템", price: 14900, priceText: "14,900원", image: "🎀", affiliateUrl: "https://www.coupang.com/placeholder/49?tag=replace-me", isRealAffiliateLink: false, comment: "부담 없는데 성의 있어 보이는 균형감.", impulseScore: 83 },
  { id: 50, name: "미니 꽃다발 비누", category: "선물템", price: 12900, priceText: "12,900원", image: "💐", affiliateUrl: "https://www.coupang.com/placeholder/50?tag=replace-me", isRealAffiliateLink: false, comment: "꽃인 척하는 실용템이라 더 귀엽습니다.", impulseScore: 85 },
  { id: 51, name: "감성 머그컵", category: "선물템", price: 10900, priceText: "10,900원", image: "☕", affiliateUrl: "https://www.coupang.com/placeholder/51?tag=replace-me", isRealAffiliateLink: false, comment: "선물받은 척하기 좋은 데일리 컵.", impulseScore: 72 },
  { id: 52, name: "디퓨저 미니 세트", category: "선물템", price: 19900, priceText: "19,900원", image: "🕯️", affiliateUrl: "https://www.coupang.com/placeholder/52?tag=replace-me", isRealAffiliateLink: false, comment: "공간의 첫인상을 부드럽게 바꾸는 선물.", impulseScore: 80 },
  { id: 53, name: "컬러 양말 박스", category: "선물템", price: 9900, priceText: "9,900원", image: "🧦", affiliateUrl: "https://www.coupang.com/placeholder/53?tag=replace-me", isRealAffiliateLink: false, comment: "받으면 은근히 바로 쓰는 실속 있는 귀여움.", impulseScore: 71 },
  { id: 54, name: "메시지 카드 30매", category: "선물템", price: 6900, priceText: "6,900원", image: "💌", affiliateUrl: "https://www.coupang.com/placeholder/54?tag=replace-me", isRealAffiliateLink: false, comment: "말 한 줄이 선물을 갑자기 따뜻하게 만듭니다.", impulseScore: 59 },
  { id: 55, name: "프리미엄 티백 샘플러", category: "선물템", price: 16900, priceText: "16,900원", image: "🍵", affiliateUrl: "https://www.coupang.com/placeholder/55?tag=replace-me", isRealAffiliateLink: false, comment: "차분한 사람에게 주면 아주 그럴듯합니다.", impulseScore: 77 },
  { id: 56, name: "작은 감사 봉투 세트", category: "선물템", price: 5900, priceText: "5,900원", image: "🧧", affiliateUrl: "https://www.coupang.com/placeholder/56?tag=replace-me", isRealAffiliateLink: false, comment: "소소한 마음을 포장하는 데 딱 좋은 사이즈.", impulseScore: 55 },
  { id: 57, name: "말랑 고양이 키링", category: "귀여운템", price: 7900, priceText: "7,900원", image: "🐱", affiliateUrl: "https://www.coupang.com/placeholder/57?tag=replace-me", isRealAffiliateLink: false, comment: "가방에 달면 하루가 약간 말랑해집니다.", impulseScore: 90 },
  { id: 58, name: "토끼 모양 수면 안대", category: "귀여운템", price: 9900, priceText: "9,900원", image: "🐰", affiliateUrl: "https://www.coupang.com/placeholder/58?tag=replace-me", isRealAffiliateLink: false, comment: "자는 모습까지 귀엽게 만들겠다는 의지.", impulseScore: 88 },
  { id: 59, name: "미니 캐릭터 스티커북", category: "귀여운템", price: 6900, priceText: "6,900원", image: "⭐", affiliateUrl: "https://www.coupang.com/placeholder/59?tag=replace-me", isRealAffiliateLink: false, comment: "다이어리를 갑자기 성실하게 쓰고 싶어져요.", impulseScore: 84 },
  { id: 60, name: "하트 무드 집게핀", category: "귀여운템", price: 5900, priceText: "5,900원", image: "💖", affiliateUrl: "https://www.coupang.com/placeholder/60?tag=replace-me", isRealAffiliateLink: false, comment: "작지만 존재감은 꽤나 당당합니다.", impulseScore: 77 },
  { id: 61, name: "구름 쿠션 미니", category: "귀여운템", price: 15900, priceText: "15,900원", image: "☁️", affiliateUrl: "https://www.coupang.com/placeholder/61?tag=replace-me", isRealAffiliateLink: false, comment: "소파에 올리면 방이 조금 폭신한 척합니다.", impulseScore: 86 },
  { id: 62, name: "동글이 펜 파우치", category: "귀여운템", price: 11900, priceText: "11,900원", image: "✏️", affiliateUrl: "https://www.coupang.com/placeholder/62?tag=replace-me", isRealAffiliateLink: false, comment: "필통인데 표정이 있는 것 같은 귀여움.", impulseScore: 82 },
  { id: 63, name: "젤리 컬러 폰 스트랩", category: "귀여운템", price: 7900, priceText: "7,900원", image: "📿", affiliateUrl: "https://www.coupang.com/placeholder/63?tag=replace-me", isRealAffiliateLink: false, comment: "폰을 들 때마다 괜히 기분이 탱글해져요.", impulseScore: 81 },
  { id: 64, name: "미니어처 데스크 피규어", category: "귀여운템", price: 13900, priceText: "13,900원", image: "🧸", affiliateUrl: "https://www.coupang.com/placeholder/64?tag=replace-me", isRealAffiliateLink: false, comment: "책상 위에 둘 핑계가 충분한 작고 귀여운 존재.", impulseScore: 89 },
  { id: 65, name: "극세사 밀대 패드", category: "청소템", price: 8900, priceText: "8,900원", image: "🧽", affiliateUrl: "https://www.coupang.com/placeholder/65?tag=replace-me", isRealAffiliateLink: false, comment: "바닥이 반짝이면 왠지 인생도 정돈된 느낌.", impulseScore: 64 },
  { id: 66, name: "틈새 청소 브러시", category: "청소템", price: 4900, priceText: "4,900원", image: "🪥", affiliateUrl: "https://www.coupang.com/placeholder/66?tag=replace-me", isRealAffiliateLink: false, comment: "작은 틈새를 보는 눈이 생겨버립니다.", impulseScore: 69 },
  { id: 67, name: "먼지떨이 정전기형", category: "청소템", price: 7900, priceText: "7,900원", image: "🪄", affiliateUrl: "https://www.coupang.com/placeholder/67?tag=replace-me", isRealAffiliateLink: false, comment: "손 닿기 애매한 곳의 먼지를 우아하게 처리.", impulseScore: 63 },
  { id: 68, name: "배수구 클리너 스틱", category: "청소템", price: 9900, priceText: "9,900원", image: "🕳️", affiliateUrl: "https://www.coupang.com/placeholder/68?tag=replace-me", isRealAffiliateLink: false, comment: "보기 싫은 곳을 안심되는 곳으로 바꾸는 실속템.", impulseScore: 60 },
  { id: 69, name: "다용도 물티슈 캡형", category: "청소템", price: 12900, priceText: "12,900원", image: "🧴", affiliateUrl: "https://www.coupang.com/placeholder/69?tag=replace-me", isRealAffiliateLink: false, comment: "한 장 뽑는 순간 주변을 다 닦고 싶어집니다.", impulseScore: 72 },
  { id: 70, name: "창틀 청소 스펀지", category: "청소템", price: 5900, priceText: "5,900원", image: "🪟", affiliateUrl: "https://www.coupang.com/placeholder/70?tag=replace-me", isRealAffiliateLink: false, comment: "모른 척했던 창틀과 드디어 대화하는 날.", impulseScore: 58 },
  { id: 71, name: "신발 탈취 스프레이", category: "청소템", price: 10900, priceText: "10,900원", image: "👟", affiliateUrl: "https://www.coupang.com/placeholder/71?tag=replace-me", isRealAffiliateLink: false, comment: "현관의 공기를 은근히 책임지는 아이템.", impulseScore: 67 },
  { id: 72, name: "욕실 물때 제거 패드", category: "청소템", price: 7900, priceText: "7,900원", image: "🫧", affiliateUrl: "https://www.coupang.com/placeholder/72?tag=replace-me", isRealAffiliateLink: false, comment: "문질렀을 뿐인데 욕실이 살짝 새것인 척.", impulseScore: 66 },
  { id: 73, name: "실리콘 조리도구 세트", category: "주방템", price: 19900, priceText: "19,900원", image: "🍳", affiliateUrl: "https://www.coupang.com/placeholder/73?tag=replace-me", isRealAffiliateLink: false, comment: "요리 실력보다 먼저 장비가 좋아지는 기분.", impulseScore: 82 },
  { id: 74, name: "냉장고 정리 트레이", category: "주방템", price: 12900, priceText: "12,900원", image: "🧊", affiliateUrl: "https://www.coupang.com/placeholder/74?tag=replace-me", isRealAffiliateLink: false, comment: "냉장고 문 열 때마다 뿌듯함이 살짝 옵니다.", impulseScore: 76 },
  { id: 75, name: "계량스푼 컬러 세트", category: "주방템", price: 6900, priceText: "6,900원", image: "🥄", affiliateUrl: "https://www.coupang.com/placeholder/75?tag=replace-me", isRealAffiliateLink: false, comment: "대충 넣던 사람도 갑자기 레시피를 믿게 됨.", impulseScore: 62 },
  { id: 76, name: "에어프라이어 종이호일", category: "주방템", price: 9900, priceText: "9,900원", image: "🧻", affiliateUrl: "https://www.coupang.com/placeholder/76?tag=replace-me", isRealAffiliateLink: false, comment: "설거지하기 싫은 마음을 이해하는 종이.", impulseScore: 86 },
  { id: 77, name: "밀폐 양념통 6개", category: "주방템", price: 15900, priceText: "15,900원", image: "🧂", affiliateUrl: "https://www.coupang.com/placeholder/77?tag=replace-me", isRealAffiliateLink: false, comment: "양념이 줄 서 있으면 요리 고수처럼 보입니다.", impulseScore: 74 },
  { id: 78, name: "접이식 도마", category: "주방템", price: 11900, priceText: "11,900원", image: "🥕", affiliateUrl: "https://www.coupang.com/placeholder/78?tag=replace-me", isRealAffiliateLink: false, comment: "재료 옮길 때 흘리는 확률을 현저히 낮춰요.", impulseScore: 71 },
  { id: 79, name: "수세미 거치대", category: "주방템", price: 5900, priceText: "5,900원", image: "🧼", affiliateUrl: "https://www.coupang.com/placeholder/79?tag=replace-me", isRealAffiliateLink: false, comment: "싱크대가 갑자기 작은 시스템을 갖춥니다.", impulseScore: 64 },
  { id: 80, name: "미니 채반 세트", category: "주방템", price: 8900, priceText: "8,900원", image: "🥬", affiliateUrl: "https://www.coupang.com/placeholder/80?tag=replace-me", isRealAffiliateLink: false, comment: "씻고 털고 담는 과정이 조금 귀여워져요.", impulseScore: 68 },
  { id: 81, name: "암막 수면 안대", category: "수면템", price: 9900, priceText: "9,900원", image: "😴", affiliateUrl: "https://www.coupang.com/placeholder/81?tag=replace-me", isRealAffiliateLink: false, comment: "낮잠에도 밤 같은 진심을 부여합니다.", impulseScore: 83 },
  { id: 82, name: "라벤더 필로우 미스트", category: "수면템", price: 12900, priceText: "12,900원", image: "🌙", affiliateUrl: "https://www.coupang.com/placeholder/82?tag=replace-me", isRealAffiliateLink: false, comment: "베개에 뿌리면 오늘 하루가 조용히 닫히는 느낌.", impulseScore: 78 },
  { id: 83, name: "메모리폼 목베개", category: "수면템", price: 17900, priceText: "17,900원", image: "🛏️", affiliateUrl: "https://www.coupang.com/placeholder/83?tag=replace-me", isRealAffiliateLink: false, comment: "목에게 사과하는 가장 실용적인 방법.", impulseScore: 80 },
  { id: 84, name: "침대 헤드 수납 포켓", category: "수면템", price: 11900, priceText: "11,900원", image: "📚", affiliateUrl: "https://www.coupang.com/placeholder/84?tag=replace-me", isRealAffiliateLink: false, comment: "폰과 책이 바닥으로 추락하는 밤을 줄입니다.", impulseScore: 73 },
  { id: 85, name: "부드러운 수면 양말", category: "수면템", price: 7900, priceText: "7,900원", image: "🧦", affiliateUrl: "https://www.coupang.com/placeholder/85?tag=replace-me", isRealAffiliateLink: false, comment: "발끝부터 따뜻해지는 소확행.", impulseScore: 81 },
  { id: 86, name: "화이트노이즈 미니기기", category: "수면템", price: 29900, priceText: "29,900원", image: "🎧", affiliateUrl: "https://www.coupang.com/placeholder/86?tag=replace-me", isRealAffiliateLink: false, comment: "잠들기 전 머릿속 탭을 하나씩 닫아주는 느낌.", impulseScore: 85 },
  { id: 87, name: "쿨링 베개 커버", category: "수면템", price: 15900, priceText: "15,900원", image: "❄️", affiliateUrl: "https://www.coupang.com/placeholder/87?tag=replace-me", isRealAffiliateLink: false, comment: "뒤척이는 밤에 시원한 변명 하나 추가.", impulseScore: 74 },
  { id: 88, name: "무드 취침등 타이머형", category: "수면템", price: 18900, priceText: "18,900원", image: "🛋️", affiliateUrl: "https://www.coupang.com/placeholder/88?tag=replace-me", isRealAffiliateLink: false, comment: "불 끄러 일어나기 싫은 마음까지 배려.", impulseScore: 86 },
  { id: 89, name: "욕실 슬리퍼 논슬립", category: "욕실템", price: 8900, priceText: "8,900원", image: "🩴", affiliateUrl: "https://www.coupang.com/placeholder/89?tag=replace-me", isRealAffiliateLink: false, comment: "미끄러움과 축축함 사이의 평화를 지켜요.", impulseScore: 66 },
  { id: 90, name: "샤워기 필터 리필팩", category: "욕실템", price: 12900, priceText: "12,900원", image: "🚿", affiliateUrl: "https://www.coupang.com/placeholder/90?tag=replace-me", isRealAffiliateLink: false, comment: "씻는 시간이 괜히 더 깨끗한 기분.", impulseScore: 75 },
  { id: 91, name: "칫솔 살균 거치대", category: "욕실템", price: 24900, priceText: "24,900원", image: "🪥", affiliateUrl: "https://www.coupang.com/placeholder/91?tag=replace-me", isRealAffiliateLink: false, comment: "칫솔에게도 자기 자리와 조명이 생깁니다.", impulseScore: 79 },
  { id: 92, name: "방수 샤워 폰케이스", category: "욕실템", price: 6900, priceText: "6,900원", image: "📱", affiliateUrl: "https://www.coupang.com/placeholder/92?tag=replace-me", isRealAffiliateLink: false, comment: "샤워 중 플레이리스트를 지키는 방수 수호자.", impulseScore: 82 },
  { id: 93, name: "흡착식 비누 받침", category: "욕실템", price: 5900, priceText: "5,900원", image: "🧼", affiliateUrl: "https://www.coupang.com/placeholder/93?tag=replace-me", isRealAffiliateLink: false, comment: "비누가 물러지는 슬픔을 줄여줍니다.", impulseScore: 59 },
  { id: 94, name: "욕실 발매트 규조토", category: "욕실템", price: 15900, priceText: "15,900원", image: "🟫", affiliateUrl: "https://www.coupang.com/placeholder/94?tag=replace-me", isRealAffiliateLink: false, comment: "젖은 발자국을 순식간에 덜 민망하게.", impulseScore: 77 },
  { id: 95, name: "샴푸 디스펜서 3구", category: "욕실템", price: 21900, priceText: "21,900원", image: "🧴", affiliateUrl: "https://www.coupang.com/placeholder/95?tag=replace-me", isRealAffiliateLink: false, comment: "욕실 벽이 갑자기 호텔 흉내를 냅니다.", impulseScore: 81 },
  { id: 96, name: "헤어 드라이 타월", category: "욕실템", price: 9900, priceText: "9,900원", image: "🧖", affiliateUrl: "https://www.coupang.com/placeholder/96?tag=replace-me", isRealAffiliateLink: false, comment: "머리 말리는 시간을 조금 덜 지루하게.", impulseScore: 74 },
  { id: 97, name: "책상 컵 워머", category: "책상템", price: 22900, priceText: "22,900원", image: "♨️", affiliateUrl: "https://www.coupang.com/placeholder/97?tag=replace-me", isRealAffiliateLink: false, comment: "커피가 식기 전에 마음도 식는 일을 방지.", impulseScore: 88 },
  { id: 98, name: "접이식 장바구니 카트", category: "생활템", price: 34900, priceText: "34,900원", image: "🛒", affiliateUrl: "https://www.coupang.com/placeholder/98?tag=replace-me", isRealAffiliateLink: false, comment: "무거운 장보기의 후회 포인트를 줄여줍니다.", impulseScore: 73 },
  { id: 99, name: "미니 전기포트 0.6L", category: "자취템", price: 27900, priceText: "27,900원", image: "🫖", affiliateUrl: "https://www.coupang.com/placeholder/99?tag=replace-me", isRealAffiliateLink: false, comment: "컵라면과 차 사이에서 매우 성실하게 일합니다.", impulseScore: 84 },
  { id: 100, name: "휴대용 손난로 보조배터리", category: "전자기기", price: 25900, priceText: "25,900원", image: "🔥", affiliateUrl: "https://www.coupang.com/placeholder/100?tag=replace-me", isRealAffiliateLink: false, comment: "손도 충전도 둘 다 챙기는 욕심 많은 따뜻함.", impulseScore: 86 },
  { id: 101, name: "시리얼 보관 디스펜서", category: "주방템", price: 18900, priceText: "18,900원", image: "🥣", affiliateUrl: "https://www.coupang.com/placeholder/101?tag=replace-me", isRealAffiliateLink: false, comment: "아침 식사가 갑자기 카페테리아처럼 굴러갑니다.", impulseScore: 78 },
  { id: 102, name: "목 어깨 찜질팩", category: "생활템", price: 16900, priceText: "16,900원", image: "🧣", affiliateUrl: "https://www.coupang.com/placeholder/102?tag=replace-me", isRealAffiliateLink: false, comment: "어깨가 오늘 좀 살겠다고 말하는 듯한 온기.", impulseScore: 87 },
  { id: 103, name: "휴대용 미니 선풍기", category: "전자기기", price: 19900, priceText: "19,900원", image: "🌬️", affiliateUrl: "https://www.coupang.com/placeholder/103?tag=replace-me", isRealAffiliateLink: false, comment: "더운 날 얼굴 앞에 개인 바람을 소환.", impulseScore: 83 },
  { id: 104, name: "냉동실 아이스볼 트레이", category: "주방템", price: 9900, priceText: "9,900원", image: "🧊", affiliateUrl: "https://www.coupang.com/placeholder/104?tag=replace-me", isRealAffiliateLink: false, comment: "음료 한 잔이 괜히 홈바 메뉴처럼 보입니다.", impulseScore: 80 },
  { id: 105, name: "운동복 세탁망 세트", category: "운동템", price: 7900, priceText: "7,900원", image: "🧺", affiliateUrl: "https://www.coupang.com/placeholder/105?tag=replace-me", isRealAffiliateLink: false, comment: "늘어남과 엉킴을 막아주는 조용한 매니저.", impulseScore: 61 },
  { id: 106, name: "비타민 젤리 멀티팩", category: "간식", price: 16900, priceText: "16,900원", image: "🍊", affiliateUrl: "https://www.coupang.com/placeholder/106?tag=replace-me", isRealAffiliateLink: false, comment: "간식인데 괜히 몸에게 미안하지 않은 선택.", impulseScore: 84 },
  { id: 107, name: "케이블 네임 태그", category: "책상템", price: 5900, priceText: "5,900원", image: "🏷️", affiliateUrl: "https://www.coupang.com/placeholder/107?tag=replace-me", isRealAffiliateLink: false, comment: "이 선이 뭐였지 하는 혼란을 예쁘게 차단.", impulseScore: 60 },
  { id: 108, name: "곰돌이 얼음틀", category: "귀여운템", price: 8900, priceText: "8,900원", image: "🧸", affiliateUrl: "https://www.coupang.com/placeholder/108?tag=replace-me", isRealAffiliateLink: false, comment: "얼음까지 귀여울 필요가 있나 싶지만 있습니다.", impulseScore: 92 },
  { id: 109, name: "자동 치약 짜개", category: "욕실템", price: 7900, priceText: "7,900원", image: "🦷", affiliateUrl: "https://www.coupang.com/placeholder/109?tag=replace-me", isRealAffiliateLink: false, comment: "끝까지 알뜰하게 짜는 묘한 만족감.", impulseScore: 73 },
  { id: 110, name: "초미세 먼지떨이 리필", category: "청소템", price: 6900, priceText: "6,900원", image: "🧹", affiliateUrl: "https://www.coupang.com/placeholder/110?tag=replace-me", isRealAffiliateLink: false, comment: "먼지를 보면 일단 닦고 싶어지는 사람에게.", impulseScore: 65 },
  { id: 111, name: "미니 가습기 USB형", category: "전자기기", price: 21900, priceText: "21,900원", image: "💨", affiliateUrl: "https://www.coupang.com/placeholder/111?tag=replace-me", isRealAffiliateLink: false, comment: "책상 위 작은 구름 같은 촉촉함.", impulseScore: 81 },
  { id: 112, name: "소형 빨래 건조대", category: "자취템", price: 23900, priceText: "23,900원", image: "🧦", affiliateUrl: "https://www.coupang.com/placeholder/112?tag=replace-me", isRealAffiliateLink: false, comment: "양말과 수건에게 적당한 무대를 마련.", impulseScore: 69 },
  { id: 113, name: "무릎 담요 극세사", category: "수면템", price: 14900, priceText: "14,900원", image: "🧸", affiliateUrl: "https://www.coupang.com/placeholder/113?tag=replace-me", isRealAffiliateLink: false, comment: "책상 앞에서도 침대 같은 안락함을 살짝.", impulseScore: 86 },
  { id: 114, name: "오트밀 컵 12개입", category: "간식", price: 18900, priceText: "18,900원", image: "🥣", affiliateUrl: "https://www.coupang.com/placeholder/114?tag=replace-me", isRealAffiliateLink: false, comment: "아침을 챙기는 사람 흉내 내기 좋은 구성.", impulseScore: 72 },
  { id: 115, name: "스테인리스 빨대 세트", category: "주방템", price: 7900, priceText: "7,900원", image: "🥤", affiliateUrl: "https://www.coupang.com/placeholder/115?tag=replace-me", isRealAffiliateLink: false, comment: "음료 취향에 작은 반짝임을 더합니다.", impulseScore: 67 },
  { id: 116, name: "데일리 향수 공병", category: "생활템", price: 5900, priceText: "5,900원", image: "🧪", affiliateUrl: "https://www.coupang.com/placeholder/116?tag=replace-me", isRealAffiliateLink: false, comment: "가방 속에 향기 한 방울을 챙기는 방법.", impulseScore: 76 },
  { id: 117, name: "선물 포장 리본 세트", category: "선물템", price: 8900, priceText: "8,900원", image: "🎁", affiliateUrl: "https://www.coupang.com/placeholder/117?tag=replace-me", isRealAffiliateLink: false, comment: "평범한 물건도 갑자기 마음 담긴 선물처럼.", impulseScore: 70 },
  { id: 118, name: "LED 독서등 클립형", category: "책상템", price: 15900, priceText: "15,900원", image: "📖", affiliateUrl: "https://www.coupang.com/placeholder/118?tag=replace-me", isRealAffiliateLink: false, comment: "밤의 집중력을 작게 켜두는 조명.", impulseScore: 82 },
  { id: 119, name: "욕실 배수구 머리카락 필터", category: "욕실템", price: 4900, priceText: "4,900원", image: "🛁", affiliateUrl: "https://www.coupang.com/placeholder/119?tag=replace-me", isRealAffiliateLink: false, comment: "나중의 막힘보다 지금의 작은 예방이 낫죠.", impulseScore: 62 },
  { id: 120, name: "귀여운 냉장고 자석 세트", category: "귀여운템", price: 10900, priceText: "10,900원", image: "🧲", affiliateUrl: "https://www.coupang.com/placeholder/120?tag=replace-me", isRealAffiliateLink: false, comment: "냉장고 문도 꾸밀 권리가 있습니다.", impulseScore: 79 }
];

const gradients = [
  "linear-gradient(135deg, #ffe083, #ff9bb5)",
  "linear-gradient(135deg, #98f5d1, #7ea7ff)",
  "linear-gradient(135deg, #ffd4a3, #ff7f87)",
  "linear-gradient(135deg, #b7f8db, #ffe066)",
  "linear-gradient(135deg, #d9c7ff, #8bd7ff)",
  "linear-gradient(135deg, #fff0a8, #9be7c2)"
];

const elements = {
  form: document.querySelector("#drawForm"),
  budgetInput: document.querySelector("#budgetInput"),
  statusMessage: document.querySelector("#statusMessage"),
  productCard: document.querySelector("#productCard"),
  recentList: document.querySelector("#recentList"),
  likedList: document.querySelector("#likedList"),
  quickButtons: document.querySelectorAll("[data-budget]"),
  responsiveDetails: document.querySelectorAll("[data-responsive-details]")
};

let recentIds = readIds(STORAGE_KEYS.recent);
let likedIds = readIds(STORAGE_KEYS.liked);
let currentProduct = null;

function readIds(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return Array.isArray(parsed) ? parsed.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

function saveIds(key, ids) {
  localStorage.setItem(key, JSON.stringify(ids));
}

function findProduct(id) {
  return [...REAL_PRODUCTS, ...SAMPLE_PRODUCTS].find((product) => product.id === id);
}

function money(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function isTemporaryAffiliateUrl(url) {
  return !url || url.includes("/placeholder/") || url.includes("replace-me") || url === "PASTE_COUPANG_PARTNERS_LINK_HERE";
}

function isAffiliateLinkReady(product) {
  return Boolean(product.affiliateUrl && product.isRealAffiliateLink && !isTemporaryAffiliateUrl(product.affiliateUrl));
}

function isSampleProduct(product) {
  return SAMPLE_PRODUCTS.some((sampleProduct) => sampleProduct.id === product.id);
}

function getProductBadges(product) {
  const badges = [product.category, `충동구매 ${product.impulseScore}점`];

  if (isSampleProduct(product)) {
    badges.push("샘플 / 링크 준비중");
  } else if (!isAffiliateLinkReady(product)) {
    badges.push("실제 링크 입력 대기");
  }

  return badges;
}

function isImageUrl(image) {
  return /^https?:\/\//.test(image);
}

function renderProductImage(product) {
  if (isImageUrl(product.image)) {
    return `<img class="product-img" src="${product.image}" alt="${product.name}">`;
  }

  return `<div class="product-emoji" aria-hidden="true">${product.image || "🛒"}</div>`;
}

function renderMiniImage(product, gradient) {
  if (isImageUrl(product.image)) {
    return `<img class="mini-img" src="${product.image}" alt="">`;
  }

  return `<div class="mini-thumb" style="background: ${gradient}">${product.image || "🛒"}</div>`;
}

function renderAffiliateAction(product, className = "coupang-link") {
  if (!isAffiliateLinkReady(product)) {
    return `<button class="${className} pending-link" type="button" disabled>링크 준비중</button>`;
  }

  return `
    <a
      class="${className}"
      href="${product.affiliateUrl}"
      target="_blank"
      rel="sponsored noopener noreferrer"
    >쿠팡에서 보기</a>
  `;
}

async function fetchRandomProductFromApi(maxPrice) {
  /*
    향후 쿠팡 파트너스 API 서버를 붙일 자리입니다.

    예시:
    const response = await fetch(`/api/random-product?maxPrice=${encodeURIComponent(maxPrice)}`);
    if (!response.ok) return null;
    return response.json();

    현재 GitHub Pages 정적 MVP에서는 API를 호출하지 않습니다.
    Access Key, Secret Key는 반드시 서버에만 보관하세요.
  */
  return null;
}

function getRandomItem(candidates) {
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function getAvailableCandidates(sourceProducts, budget) {
  return sourceProducts.filter((product) => product.price <= budget);
}

function pickRandomProduct(budget) {
  const realCandidates = getAvailableCandidates(REAL_PRODUCTS, budget).filter(isAffiliateLinkReady);
  const sampleCandidates = getAvailableCandidates(SAMPLE_PRODUCTS, budget);
  const candidates = realCandidates.length > 0 ? realCandidates : sampleCandidates;

  if (candidates.length === 0) return null;
  const cooledCandidates = candidates.filter((product) => !recentIds.includes(product.id));
  const pool = cooledCandidates.length > 0 ? cooledCandidates : candidates;
  return getRandomItem(pool);
}

function drawProduct() {
  const budget = Number(elements.budgetInput.value);
  if (!Number.isFinite(budget) || budget <= 0) {
    showStatus("금액을 숫자로 넣어주세요. 0원 뽑기는 아직 마음만 받겠습니다.");
    elements.budgetInput.focus();
    return;
  }

  const product = pickRandomProduct(budget);
  if (!product) {
    currentProduct = null;
    showStatus("이 금액으로는 추천할 상품이 없어요. 예산을 조금만 올려볼까요?");
    renderEmpty("😢", "후보가 없어요", `${money(budget)}원 이하 더미 상품을 아직 준비하지 못했어요.`);
    focusResultOnMobile();
    return;
  }

  currentProduct = product;
  recentIds = [product.id, ...recentIds.filter((id) => id !== product.id)].slice(0, 5);
  saveIds(STORAGE_KEYS.recent, recentIds);
  showStatus(`${money(budget)}원 이하에서 하나 뽑았습니다. 이건 좀 탐나는데?`);
  renderProduct(product);
  renderLists();
  focusResultOnMobile();
}

function showStatus(message) {
  elements.statusMessage.textContent = message;
}

function focusResultOnMobile() {
  if (!window.matchMedia("(max-width: 720px)").matches) return;

  window.requestAnimationFrame(() => {
    elements.productCard.scrollIntoView({ block: "start", behavior: "smooth" });
  });
}

function renderEmpty(icon, title, copy) {
  elements.productCard.className = "product-card empty pop";
  elements.productCard.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <h2>${title}</h2>
      <p>${copy}</p>
    </div>
  `;
}

function renderProduct(product) {
  const isLiked = likedIds.includes(product.id);
  const gradient = gradients[product.id % gradients.length];
  const productImage = renderProductImage(product);
  const affiliateAction = renderAffiliateAction(product);
  const badges = getProductBadges(product);

  elements.productCard.className = "product-card pop";
  elements.productCard.innerHTML = `
    <div class="product-visual" style="background: ${gradient}">
      ${productImage}
    </div>
    <div class="product-body">
      <div class="product-meta">
        ${badges.map((badge) => `<span class="pill">${badge}</span>`).join("")}
      </div>
      <div>
        <h2 class="product-title">${product.name}</h2>
        <div class="price-block">
          <span class="price-label">추천 가격대</span>
          <div class="price">${product.priceText}</div>
          <p class="price-note">가격은 쿠팡 페이지에서 확인해주세요.</p>
        </div>
      </div>
      <div class="comment-box">💬 ${product.comment}</div>
      <div class="score-row">
        <div class="score-label">
          <span>충동구매 점수</span>
          <span>${product.impulseScore}/100</span>
        </div>
        <div class="score-track" aria-hidden="true">
          <div class="score-fill" style="width: ${product.impulseScore}%"></div>
        </div>
      </div>
      <div class="disclosure">${PARTNERS_DISCLOSURE}</div>
      <div class="action-row">
        ${affiliateAction}
        <button class="secondary-btn" type="button" id="rerollButton">🔁 다시 돌리기</button>
        <button class="ghost-btn" type="button" id="likeButton">${isLiked ? "💛 찜 해제" : "🤍 찜하기"}</button>
      </div>
    </div>
  `;

  window.setTimeout(() => elements.productCard.classList.remove("pop"), 300);
}

function toggleLike() {
  if (!currentProduct) return;

  if (likedIds.includes(currentProduct.id)) {
    likedIds = likedIds.filter((id) => id !== currentProduct.id);
  } else {
    likedIds = [currentProduct.id, ...likedIds.filter((id) => id !== currentProduct.id)];
  }

  saveIds(STORAGE_KEYS.liked, likedIds);
  renderProduct(currentProduct);
  renderLists();
}

function removeLike(id) {
  likedIds = likedIds.filter((likedId) => likedId !== id);
  saveIds(STORAGE_KEYS.liked, likedIds);
  if (currentProduct?.id === id) renderProduct(currentProduct);
  renderLists();
}

function renderLists() {
  renderMiniList(elements.recentList, recentIds, "아직 뽑은 상품이 없어요.", false);
  renderMiniList(elements.likedList, likedIds, "마음에 드는 상품을 찜해보세요.", true);
}

function renderMiniList(container, ids, emptyText, removable) {
  const validProducts = ids.map(findProduct).filter(Boolean);
  if (validProducts.length === 0) {
    container.innerHTML = `<p class="empty-mini">${emptyText}</p>`;
    return;
  }

  container.innerHTML = validProducts.map((product) => {
    const gradient = gradients[product.id % gradients.length];
    const miniImage = renderMiniImage(product, gradient);
    const affiliateAction = renderAffiliateAction(product, "mini-link");
    const removeButton = removable
      ? `<button class="text-btn" type="button" data-remove-like="${product.id}">삭제</button>`
      : "";

    return `
      <div class="mini-item">
        ${miniImage}
        <div class="mini-copy">
          <strong>${product.name}</strong>
          <span>${product.priceText} · ${product.category}</span>
        </div>
        <div class="mini-actions">
          ${affiliateAction}
          ${removeButton}
        </div>
      </div>
    `;
  }).join("");
}

function syncResponsiveDetails() {
  const shouldOpen = window.matchMedia("(min-width: 960px)").matches;
  elements.responsiveDetails.forEach((details) => {
    details.open = shouldOpen;
  });
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  drawProduct();
});

elements.productCard.addEventListener("click", (event) => {
  if (event.target.closest("#rerollButton")) drawProduct();
  if (event.target.closest("#likeButton")) toggleLike();
});

elements.likedList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-like]");
  if (!button) return;
  removeLike(Number(button.dataset.removeLike));
});

elements.quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    elements.budgetInput.value = button.dataset.budget;
    drawProduct();
  });
});

window.addEventListener("resize", syncResponsiveDetails);
syncResponsiveDetails();
renderLists();
