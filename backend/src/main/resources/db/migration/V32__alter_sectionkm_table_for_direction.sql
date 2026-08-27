ALTER TABLE M_SectionKm
    ADD COLUMN direction VARCHAR(4);

UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK01';      --東北新幹線各駅下り 東京-上野
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK02';      --上野-大宮
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK03';      --大宮-小山
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK04';      --小山-宇都宮
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK05';      --宇都宮-那須高原
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK06';      --那須高原-新白河
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK07';      --新白河-郡山
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK08';      --郡山-福島
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK09';      --福島-白石蔵王
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK10';      --白石蔵王-仙台
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK11';      --仙台-古川
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK12';      --古川-くりこま高原
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK13';      --くりこま高原-一ノ関
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK14';      --一ノ関-水沢江刺
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK15';      --水沢江刺-北上
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK16';      --北上-新花巻
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK17';      --新花巻-盛岡
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK18';      --盛岡-いわて沼宮内
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK19';      --いわて沼宮内-二戸
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK20';      --二戸-八戸
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK21';      --八戸-七戸十和田
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK22';      --七戸十和田-新青森
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK24';      --東北新幹線はやぶさ急行下り 東京-大宮
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK25';      --大宮-仙台
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK26';      --仙台-盛岡
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK27';      --盛岡-八戸
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK28';      --八戸-新青森
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK29';      --盛岡-新青森
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK30';      --東北新幹線やまびこ急行下り 大宮-宇都宮
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK31';      --宇都宮-福島
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK32';      --福島-仙台
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'THK33';      --宇都宮-郡山
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK51';        --東北新幹線各駅上り　新青森-七戸十和田
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK52';        --七戸十和田-八戸
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK53';        --八戸-二戸
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK54';        --二戸-いわて沼宮内
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK55';        --いわて沼宮内-盛岡
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK56';        --盛岡-新花巻
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK57';        --新花巻-北上
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK58';        --北上-水沢江刺
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK59';        --水沢江刺-一ノ関
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK60';        --一ノ関-くりこま高原
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK61';        --くりこま高原-古川
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK62';        --古川-仙台
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK63';        --仙台-白石蔵王
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK64';        --白石蔵王-福島
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK65';        --福島-郡山
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK66';        --郡山-新白河
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK67';        --新白河-那須高原
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK68';        --那須高原-宇都宮
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK69';        --宇都宮-小山
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK70';        --小山-大宮
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK71';        --大宮-上野
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK72';        --上野-東京
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK73';        --東北新幹線はやぶさ急行上り　新青森-盛岡
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK74';        --新青森-八戸
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK75';        --八戸-盛岡
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK76';        --盛岡-仙台
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK77';        --仙台-大宮
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK78';        --大宮-東京
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK79';        --東北新幹線やまびこ急行上り　郡山-宇都宮
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK80';        --仙台-福島
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK81';        --宇都宮-福島
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'THK82';        --宇都宮-大宮
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'YMG01';      --山形新幹線各駅下り 福島-米沢
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'YMG02';      --米沢-高畠
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'YMG03';      --高畠-赤湯
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'YMG04';      --赤湯-かみのやま温泉
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'YMG05';      --かみのやま温泉-山形
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'YMG06';      --山形-天童
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'YMG07';      --天童-さくらんぼ東根
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'YMG08';      --さくらんぼ東根-村山
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'YMG09';      --村山-大石田
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'YMG10';      --大石田-新庄
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'YMG11';      --山形新幹線急行下り 米沢-山形
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'YMG51';        --山形新幹線各駅上り 新庄-大石田
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'YMG52';        --大石田-村山
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'YMG53';        --村山-さくらんぼ東根
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'YMG54';        --さくらんぼ東根-天童
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'YMG55';        --天童-山形
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'YMG56';        --山形-かみのやま温泉
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'YMG57';        --かみのやま温泉-赤湯
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'YMG58';        --赤湯-高畠
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'YMG59';        --高畠-米沢
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'YMG60';        --米沢-福島
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'YMG61';        --山形新幹線急行上り 山形-米沢
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'AKT01';      --秋田新幹線各駅下り 盛岡-雫石
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'AKT02';      --雫石-田沢湖
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'AKT03';      --田沢湖-角館
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'AKT04';      --角館-大曲
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'AKT05';      --大曲-秋田
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'AKT06';      --秋田新幹線急行下り 盛岡-大曲
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'AKT07';      --盛岡-田沢湖
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'AKT51';        --秋田新幹線各駅上り 秋田-大曲
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'AKT52';        --大曲-角館
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'AKT53';        --角館-田沢湖
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'AKT54';        --田沢湖-雫石
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'AKT55';        --雫石-盛岡
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'AKT56';        --秋田新幹線急行上り 田沢湖-盛岡
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'AKT57';        --大曲-盛岡
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET01';      --上越新幹線各駅下り 大宮-熊谷
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET02';      --熊谷-本庄早稲田
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET03';      --本庄早稲田-高崎
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET04';      --高崎-上毛高原
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET05';      --上毛高原-越後湯沢
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET06';      --越後湯沢-ガーラ湯沢
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET07';      --越後湯沢-浦佐
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET08';      --浦佐-長岡
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET09';      --長岡-燕三条
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET10';      --燕三条-新潟
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET11';      --上越新幹線急行下り 大宮-長岡
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET12';      --長岡-新潟
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET13';      --大宮-高崎
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET14';      --高崎-越後湯沢
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET15';      --越後湯沢-長岡
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'JET16';      --熊谷-高崎
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET51';        --上越新幹線各駅上り 新潟-燕三条
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET52';        --燕三条-長岡
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET53';        --長岡-浦佐
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET54';        --浦佐-越後湯沢
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET55';        --ガーラ湯沢-越後湯沢
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET56';        --越後湯沢-上毛高原
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET57';        --上毛高原-高崎
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET58';        --高崎-本庄早稲田
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET59';        --本庄早稲田-熊谷
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET60';        --熊谷-大宮
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET61';        --上越新幹線急行上り 長岡-越後湯沢
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET62';        --越後湯沢-高崎
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET63';        --高崎-大宮
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET64';        --新潟-長岡
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET65';        --長岡-大宮
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'JET66';        --高崎-熊谷
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'HKR01';      --北陸新幹線各駅下り 高崎-安中榛名
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'HKR02';      --安中榛名-軽井沢
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'HKR03';      --軽井沢-佐久平
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'HKR04';      --佐久平-上田
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'HKR05';      --上田-長野
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'HKR06';      --長野-飯山
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'HKR07';      --飯山-上越妙高
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'HKR08';      --北陸新幹線急行下り 大宮-軽井沢
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'HKR09';      --大宮-長野
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'HKR10';      --高崎-軽井沢
UPDATE M_SectionKm SET direction = 'DOWN' WHERE section_cd = 'HKR11';      --長野-上越妙高
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'HKR51';        --北陸新幹線各駅上り 上越妙高-飯山
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'HKR52';        --飯山-長野
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'HKR53';        --長野-上田
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'HKR54';        --上田-佐久平
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'HKR55';        --佐久平-軽井沢
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'HKR56';        --軽井沢-安中榛名
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'HKR57';        --安中榛名-高崎
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'HKR58';        --北陸新幹線急行上り 上越妙高-長野
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'HKR59';        --軽井沢-高崎
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'HKR60';        --長野-大宮
UPDATE M_SectionKm SET direction = 'UP' WHERE section_cd = 'HKR61';        --軽井沢-大宮

ALTER TABLE M_SectionKm
    ALTER COLUMN direction SET NOT NULL;

ALTER TABLE M_SectionKm
    ADD CONSTRAINT chk_m_sectionkm_direction CHECK (direction IN ('UP', 'DOWN'));
