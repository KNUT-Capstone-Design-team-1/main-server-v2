# MainServer
> 이게 뭐약? 의 메인서버입니다.

## Description
> 1. 애플리케이션으로부터 전송된 이미지 url을 인공지능 서버에 전달합니다.
> 2. 인공지능서버에서 추출된 알약 특징들을 셀레니움을 이용하여 약학정보원(https://www.health.kr/) 에서 검색을하고 검색 결과를 크롤링 합니다.
> 3. 검색결과를 DB에 넣고 애플리케이션으로 결과를 전달합니다.

## 개발환경
|도구|버전|
|------|--------|
|Framework|Spring Boot 2.4.5|
|OS|Windows 10, Ubuntu 18.0.4|
|IDE|IntelliJ IDEA Community|
|JDK|JDK 11|
|DataBase|MySQL 8.0.2|
|Build Tool|Gradle 6.8.3|

## 실행 방법
* 준비사항
  * <code>Gradle</code> or <code>IntelliJ IDEA</code>
  
  * <code>JDK</code> (11)
  
  * <code>Spring Boot</code> (>=2.x)
  
  *  <code>chromedriver</code> (본인 크롬 버전에 맞게)
  
* 저장소 <code>clone</code>
  * <pre>$ git clone https://github.com/KNUT-Capstone-Design-team-1/SearchServer.git</pre>

* DB는 <code>MySQL</code>를 사용해야 합니다.
* 프로젝트 내 <code>pill\src\main\resources</code> 경로에 <code>application.yml</code> 생성 및 수정.
<pre>
<span>spring</span>:
  <span>datasource</span>:
    <span>url</span>: jdbc:mysql://{본인의 DB 서버 주소}:{port번호}/{database}?serverTimezone=UTC&characterEncoding=UTF-8
    <span>username</span>: {DB 아이디}
    <span>password</span>: {DB 비밀번호}
    <span>driver-class-name</span>: com.mysql.cj.jdbc.Driver 

  <span>jpa</span>:
    <span>open-in-view</span>: false
    <span>database-platform</span>: org.hibernate.dialect.MySQL8Dialect
    <span>hibernate</span>:
      <span>ddl-auto</span>: none
    <span>properties</span>:
      <span>hibernate</span>:
        <span>show_sql</span>: true
        <span>format_sql</span>: true
</pre>
* <code>IntelliJ IDEA</code>에서 해당 프로젝트를 Open
  * <pre>./gradlew build</pre>

## Dependencies
  * <code>Spring DATA JPA</code>

  * <code>Spring WEB</code>
  
  * <code>MySQL Driver</code>

  * <code>Lombok</code>

  * <code>Java Selenium</code>

## 도메인 명세

|Columns|Data Type|
|------|--------|
|pill_id|bigint AI PK|
|drug_caution|longtext|
|drug_color|varchar(255)|
|durg_discrimination|varchar(255)|
|drug_dosage|varchar(255)|
|drug_effect|varchar(255)|
|drug_image|varchar(255)|
|drug_line|varchar(255)|
|drug_maker|varchar(255)|
|drug_name|varchar(255)|
|drug_shape|varchar(255)|
|drug_take|varchar(255)|
|drug_type|varchar(255)|

## API 명세

|Method|URI|Description|
|------|--------|---------|
|POST|/image|애플리케이션에서 이미 전송|
