import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // PgBouncer(트랜잭션 모드) 호환 설정
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function testConnection(): Promise<void> {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW() AS now');
    console.log(`✅ DB 연결 성공: ${result.rows[0].now}`);
  } finally {
    client.release();
  }
}

export async function initSchema(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id            TEXT PRIMARY KEY,
        name          TEXT NOT NULL,
        is_international BOOLEAN NOT NULL DEFAULT FALSE,
        specialty     TEXT[] NOT NULL DEFAULT '{}',
        contact       TEXT NOT NULL DEFAULT '',
        address       TEXT NOT NULL DEFAULT '',
        website       TEXT NOT NULL DEFAULT '',
        description   TEXT NOT NULL DEFAULT '',
        featured_products TEXT[] NOT NULL DEFAULT '{}'
      );

      CREATE TABLE IF NOT EXISTS inventory_items (
        id                   TEXT PRIMARY KEY,
        name                 TEXT NOT NULL,
        category             TEXT NOT NULL,
        supplier             TEXT NOT NULL,
        firing_temp          TEXT NOT NULL,
        stock_quantity       NUMERIC NOT NULL DEFAULT 0,
        unit                 TEXT NOT NULL,
        stock_alert_threshold NUMERIC NOT NULL DEFAULT 0,
        last_updated         TEXT NOT NULL,
        notes                TEXT
      );

      CREATE TABLE IF NOT EXISTS specimen_test_tiles (
        id           TEXT PRIMARY KEY,
        title        TEXT NOT NULL,
        author       TEXT NOT NULL,
        author_email TEXT,
        clay_body    TEXT NOT NULL,
        glaze_name   TEXT NOT NULL,
        firing_type  TEXT NOT NULL,
        firing_temp  TEXT NOT NULL,
        cone_value   TEXT NOT NULL,
        description  TEXT NOT NULL,
        know_how_tips TEXT NOT NULL,
        image_url    TEXT,
        likes        INTEGER NOT NULL DEFAULT 0,
        created_at   TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS comments (
        id         TEXT PRIMARY KEY,
        tile_id    TEXT NOT NULL REFERENCES specimen_test_tiles(id) ON DELETE CASCADE,
        author     TEXT NOT NULL,
        content    TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
    console.log('✅ 스키마 초기화 완료');
  } finally {
    client.release();
  }
}

export async function seedInitialData(): Promise<void> {
  const client = await pool.connect();
  try {
    // 이미 데이터 있으면 시드 건너뜀
    const { rows } = await client.query('SELECT COUNT(*) FROM suppliers');
    if (parseInt(rows[0].count) > 0) return;

    await client.query(`
      INSERT INTO suppliers (id, name, is_international, specialty, contact, address, website, description, featured_products) VALUES
      ('s-jungang', '중앙도재 (Jungang Ceramic Supplies)', false,
        ARRAY['백자토','산백토','수입 글레이즈','도예 도구','전기로'],
        '02-744-1233', '서울특별시 종로구 인사동길 15', 'http://www.jungangceramic.com',
        '인사동에 위치한 오랜 역사와 신뢰의 한국 대표 도재상입니다.',
        ARRAY['태토 - 백자청토 (20kg)','미국 Amaco Celadon Glazes Series','중앙 전용 백자유약']
      ),
      ('s-daewon', '대원도재 (Daewon Ceramic)', false,
        ARRAY['옹기토','조형토','청자토','석고틀','각종 소성 소모품'],
        '02-764-5551', '서울특별시 종로구 삼일대로30길 21', 'http://www.daewonpottery.com',
        '대형 성형틀, 석고 및 전통 조소 재료 라인업이 뛰어난 도재상입니다.',
        ARRAY['고강도 석고 분말 H-3','전통 대원 옹기토 (20kg)','안료 및 산화철 시리즈']
      ),
      ('s-dongyeong', '동영세라믹스 (Dongyeong Ceramics)', false,
        ARRAY['외산 소성 재료','독일 스펙트럼 유약','수입 안료','전동물레'],
        '031-638-3455', '경기도 이천시 신둔면 도자예술로 6번길', 'http://www.dycustom.co.kr',
        '한국의 대표 도예 도시 이천 신둔에 대규모 창고형 쇼룸을 보유한 도재상입니다.',
        ARRAY['Spectrum 흐름유약 시리즈','Nidec-Shimpo VL-Whisper 전동물레','독일 아르질라 점토']
      ),
      ('s-laguna', '라구나 클레이 (Laguna Clay Co., USA)', true,
        ARRAY['B-Mix 5/10 Clay','Coleman Porcelain','Raku Clay','Reduction glazes'],
        '+1-800-452-4862', '14400 Lomitas Ave, City of Industry, CA 91746, USA', 'https://www.lagunaclay.com',
        '전 세계 최고 수준의 점토 배합을 자랑하는 미국의 글로벌 탑 도재상입니다.',
        ARRAY['B-Mix 5 (Cone 5 Clays)','Coleman Porcelain Cone 10','Laguna Dry Glazes']
      ),
      ('s-amaco', '아마코 (Amaco - American Art Clay Co., USA)', true,
        ARRAY['Potters Choice Glazes','Underglazes (Velvet Series)','Brent Wheels'],
        '+1-800-374-1600', '6060 Guion Rd, Indianapolis, IN 46254, USA', 'https://www.amaco.com',
        '가정 및 전문 공방용 하이엔드 액상 유약 분야의 압도적인 리더입니다.',
        ARRAY['Amaco Velvet Underglazes (V-360-391)',$$Potter''s Choice PC-20 Blue Rutile$$,'Brent C Wheel']
      )
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO inventory_items (id, name, category, supplier, firing_temp, stock_quantity, unit, stock_alert_threshold, last_updated, notes) VALUES
      ('inv-1','백자청토 (Jungang)','Clay','중앙도재','1240°C - 1280°C (Cone 6-10)',120,'kg',40,'2026-06-20','물레 및 조형 겸용 프리미엄 백자토.'),
      ('inv-2','산백토 (Coarse)','Clay','대원도재','1200°C - 1250°C (Cone 5-6)',60,'kg',20,'2026-06-19','모래 알갱이가 섞여 있어 손성형에 적합.'),
      ('inv-3','PC-20 Blue Rutile Glaze (1 Gallon)','Glaze','아마코 (중앙수입)','1220°C - 1240°C (Cone 5-6)',2.5,'L',1.0,'2026-06-18','두껍게 시유하면 깊은 푸른색과 오팔빛 흐름이 발생.'),
      ('inv-4','산화코발트 (Cobalt Oxide)','Raw Material','동영세라믹스','전 온도대 적용 대',500,'g',100,'2026-06-15','소량만 첨가해도 진한 청색을 발현하는 천연 안료.'),
      ('inv-5','프리미엄 굽칼 (Trimming Tool No.8)','Tool','중앙도재','해당 없음',3,'piece',1,'2026-06-10','굽 깎기용 고탄소강 굽칼.')
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO specimen_test_tiles (id, title, author, author_email, clay_body, glaze_name, firing_type, firing_temp, cone_value, description, know_how_tips, likes, created_at) VALUES
      ('tile-1','백자토 위 산청 매트유 & 코발트 하이라이트','김도예 (PorcelainLover)','kim@ceramics.com',
        '소백토 (White Clay)','자체 배합 매트 투명유 + 산화코발트 1% 첨가 라이너',
        '산화채성 (Oxidation)','1240°C','Cone 6',
        '소백토의 밝은 백색 바디 위에 0.6mm 두께로 매트 투명유를 시유하고, 림 부분에는 스폰지로 산화코발트 희석액을 가볍게 터치해 시각적 포인트를 주었습니다.',
        '스폰징 할 때 스폰지의 물기를 완전히 짜내지 않으면 오버레이 안료가 흘러내려 얼룩이 생길 수 있으니 드라이하게 올리는 것을 추천합니다.',
        24,'2026-06-18'),
      ('tile-2','분청토 위 분청 가루장 기법과 동영 황토매트 매칭','박공방 (Studio_Park)','park@potter.kr',
        '분청토 (Buncheong Iron Silt)','동영 황토 매트유 (DY-204)',
        '환원채성 (Reduction)','1250°C','Cone 6-7',
        '분청토 성형 후 완전히 건조되기 전 화장토를 귀얄 붓으로 넓게 도포한 후 재벌 소성 시 가스 가마 환원 채성으로 구웠습니다.',
        '귀얄 기법을 쓸 때는 화장토의 농도가 관건입니다. 생크림 농도 정도로 되직하게 해서 슥 바르면 붓 자국이 더 선명하게 살아납니다.',
        18,'2026-06-14'),
      ('tile-3','B-Mix 5 위 아마코 블루 루틸 & 허니 플럭스 이중 시유','Chloe_Clay','chloe@lagunafan.com',
        'Laguna B-Mix 5 (Cone 5)','Amaco Honey Flux (PC-17) 위 PC-20 Blue Rutile 오버레이 (3레이어)',
        '산화채성 (Oxidation)','1220°C','Cone 5',
        '라구나 비믹스 5 점토 위에 먼저 하니 플럭스를 2번 붓질하고 건조한 후, 블루 루틸을 상단 1/2 지점에 3회 덧칠해 흘러내림 효과를 보았습니다.',
        '블루 루틸은 하니 플럭스 위에서 매우 크게 반응하여 흘러내립니다. 상단 3분의 1 지점에만 덧칠해야 바닥 선반에 유약이 흘러내리지 않습니다.',
        31,'2026-06-11')
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO comments (id, tile_id, author, content, created_at) VALUES
      ('c-1','tile-1','이세라','색감이 너무 오묘하고 고급스럽네요! 소성 스케줄 혹시 조금 더 자세히 알 수 있을까요?','2026-06-19'),
      ('c-2','tile-1','한울','공유해주신 팁대로 드라이 브러시로 테스트해보니까 저도 드디어 코발트 번짐 현상을 해결했어요 감사해요!','2026-06-20'),
      ('c-3','tile-2','토기인생','역시 환원 가마 특유의 철분 발색이 극대화된 시편이네요! 멋집니다.','2026-06-15'),
      ('c-4','tile-3','도자기초짜','이 시편 대박이네요! 전가마 산화로도 이런 환원가마 같은 결정 흐름이 나오는군요.','2026-06-12'),
      ('c-5','tile-3','인사동방랑자','비믹스 점토 특유의 부드러움과 환상의 찰떡 궁합 유약이군요. 내일 중앙도재에서 질러야겠어요.','2026-06-13')
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('✅ 초기 데이터 시드 완료');
  } finally {
    client.release();
  }
}
