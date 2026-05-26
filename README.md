# 이 돈이면 뭐 사지?

금액을 입력하면 해당 금액 이하의 랜덤 쇼핑 아이템을 추천하는 정적 웹사이트입니다.

## 로컬 실행 방법

```bash
python3 -m http.server 5173
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:5173
```

## GitHub Pages 배포 방법

이 저장소는 정적 사이트 파일이 저장소 루트에 위치하도록 구성되어 있습니다.

- `index.html`
- `style.css`
- `script.js`

GitHub Pages 설정:

1. GitHub 저장소의 `Settings`로 이동합니다.
2. 왼쪽 메뉴에서 `Pages`를 선택합니다.
3. `Build and deployment`의 `Source`를 `Deploy from a branch`로 설정합니다.
4. `Branch`를 `main`, 폴더를 `/root`로 선택합니다.
5. `Save`를 누릅니다.

설정 후 보통 몇 분 안에 아래 형식의 주소로 배포됩니다.

```text
https://USERNAME.github.io/REPOSITORY_NAME/
```

## 쿠팡 파트너스 링크 교체 방법

`script.js` 상단의 `REAL_PRODUCTS` 배열에 실제 쿠팡 파트너스 링크를 넣습니다.

```js
affiliateUrl: "PASTE_COUPANG_PARTNERS_LINK_HERE",
isRealAffiliateLink: false,
```

실제 링크로 교체한 뒤에는 아래처럼 변경합니다.

```js
affiliateUrl: "실제_쿠팡_파트너스_링크",
isRealAffiliateLink: true,
```

`isRealAffiliateLink`가 `true`이고 임시 링크가 아닐 때만 사이트에서 `쿠팡에서 보기` 버튼이 활성화됩니다.

## API 키 보안 주의사항

Access Key, Secret Key 같은 API 키는 절대 프론트엔드 코드에 넣으면 안 됩니다.

정적 사이트에 API 키를 넣으면 방문자가 브라우저 개발자 도구로 키를 볼 수 있습니다. 쿠팡 Open API를 사용할 경우에는 서버 또는 서버리스 함수 같은 백엔드에서 키를 안전하게 관리해야 합니다.
