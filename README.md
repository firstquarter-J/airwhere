# AirWhere - 미세먼지 앱

어디서나 에어췤~!

## 프로젝트 구조 (모노레포)

```
airwhere/
├── server/              # Bun + Elysia 백엔드 서버
│   ├── src/
│   │   ├── routes/     # API 라우트
│   │   └── services/   # 비즈니스 로직
│   ├── public/         # 정적 파일 (개발용 웹)
│   └── index.ts        # 서버 엔트리포인트
├── client/            # Flutter 모바일 앱
├── shared/
│   ├── types/          # 공통 TypeScript 타입
│   └── utils/          # 공통 유틸리티 함수
└── package.json        # 워크스페이스 설정
```

## 개발 환경 설정

### 전체 설치

```bash
bun install
```

### 서버 실행

```bash
# 개발 모드
bun run dev:server

# 프로덕션 모드
bun run start:server
```

## 기능

### 🌍 위치 서비스

- GPS 기반 실시간 위치 추적
- 권한 관리 시스템
- 지오코딩/역지오코딩
- 주기적 위치 업데이트

### 🌬️ 대기질 모니터링 (예정)

- 실시간 미세먼지 데이터
- 위치 기반 대기질 정보
- 알림 시스템

## API 엔드포인트

### 위치 서비스

- `GET /location/popular` - 인기 지역 목록
- `GET /location/reverse` - 좌표 → 주소 변환
- `GET /location/geocode` - 주소 → 좌표 변환
- `POST /location/current` - 현재 위치 저장
- `POST /location/track` - 위치 추적
- `GET /location/permission/status` - 권한 상태 확인
- `POST /location/permission/update` - 권한 설정 업데이트
- `GET /location/recent/:userId` - 사용자 최근 위치

## 기술 스택

### 백엔드

- **Runtime**: Bun
- **Framework**: Elysia
- **Language**: TypeScript

### 모바일 앱

- **Framework**: Flutter
- **Language**: Dart

## 워크스페이스

이 프로젝트는 Bun 워크스페이스를 사용하여 모노레포로 구성되었습니다:

- `@airwhere/types` - 공통 타입 정의
- `@airwhere/utils` - 공통 유틸리티 함수
- `airwhere-server` - 백엔드 서버
