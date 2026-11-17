import React from "react";
import { Link } from "react-router-dom";

const residencyStages = [
  {
    number: "01",
    title: "입국 전",
    english: "Pre-entry",
    icon: "✈️",
    description: "대한민국 입국과 새로운 한국 생활을 준비하는 단계",
    topics: ["입국 준비", "기초 한국어", "한국 생활 이해"],
  },
  {
    number: "02",
    title: "초기 체류",
    english: "Initial Stay",
    icon: "🏠",
    description: "한국 생활에 필요한 기본적인 의사소통을 익히는 단계",
    topics: ["외국인 등록", "은행·병원 이용", "주거·교통"],
  },
  {
    number: "03",
    title: "중기 체류",
    english: "Mid-term Stay",
    icon: "💬",
    description: "학업과 직장, 일상생활에서 의사소통 능력을 확장하는 단계",
    topics: ["학업·직장 생활", "대인 관계", "사회적 의사소통"],
  },
  {
    number: "04",
    title: "장기 체류",
    english: "Long-term Stay",
    icon: "💼",
    description: "사회적 역할과 다양한 활동에 필요한 한국어를 발전시키는 단계",
    topics: ["직무 수행", "사회 활동", "제도적 의사소통"],
  },
  {
    number: "05",
    title: "정착",
    english: "Settlement",
    icon: "🌏",
    description: "대한민국 사회의 구성원으로 안정적인 삶을 이어가는 단계",
    topics: ["지역사회 참여", "사회적 권리와 책임", "정착 생활"],
  },
];

export default function ResidencyKoreanPage() {
  return (
    <main className="bg-white">

      {/* 상단 소개 영역 */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">

          <Link
            to="/"
            className="inline-block text-sm text-blue-100 hover:text-white mb-8"
          >
            ← ROKMUN 홈으로
          </Link>

          <div className="text-center">
            <p className="text-blue-100 text-sm tracking-widest mb-4">
              YOUR GATEWAY TO KOREA
            </p>

            <h1 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
              체류 단계 기반 한국어교육
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-6">
              Residency-Based Korean Education
            </p>

            <p className="text-base md:text-lg leading-relaxed">
              입국 전부터 정착까지,
              <br />
              나의 한국 생활에 맞는 한국어교육
            </p>
          </div>

        </div>
      </section>

      {/* 교육 소개 */}
      <section className="max-w-5xl mx-auto px-6 py-14">

        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-5">
            한국어 학습, 한국에서의 삶과 연결되다
          </h2>

          <p className="text-gray-600 leading-loose max-w-3xl mx-auto">
            체류 단계 기반 한국어교육은 학습자의 한국어 숙달도뿐만
            아니라 대한민국에서의 체류 목적, 생활 환경, 사회적 역할을
            고려하는 교육입니다.
            <br /><br />
            입국 준비부터 한국 사회에 정착하기까지,
            각 단계에서 필요한 한국어 능력을 기르는 것을 목표로 합니다.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8 text-center">
          <p className="text-xl font-semibold text-blue-900 mb-3">
            한국어를 배우는 것에서 한국에서 살아가는 것으로
          </p>

          <p className="text-gray-600 leading-relaxed">
            ROKMUN은 학습자의 한국 생활 여정에 맞는
            새로운 한국어교육을 준비하고 있습니다.
          </p>
        </div>

      </section>

      {/* 체류 5단계 */}
      <section className="bg-slate-50 py-14">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
              한국 생활의 5단계
            </h2>

            <p className="text-gray-500">
              Your Korean Journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

            {residencyStages.map((stage) => (
              <div
                key={stage.number}
                className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >

                <div className="text-blue-500 text-sm font-bold mb-4">
                  STAGE {stage.number}
                </div>

                <div className="text-4xl mb-4">
                  {stage.icon}
                </div>

                <h3 className="text-xl font-bold text-blue-900 mb-1">
                  {stage.title}
                </h3>

                <p className="text-sm text-blue-500 mb-4">
                  {stage.english}
                </p>

                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  {stage.description}
                </p>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-3">
                    주요 학습 내용 예시
                  </p>

                  {stage.topics.map((topic) => (
                    <div
                      key={topic}
                      className="bg-blue-50 text-blue-700 text-xs rounded-lg px-3 py-2 mb-2"
                    >
                      {topic}
                    </div>
                  ))}
                </div>

              </div>
            ))}

          </div>

          <p className="text-sm text-gray-500 text-center mt-6">
            체류 단계는 한국어 급수와 동일하지 않으며,
            개인의 체류 목적과 생활 환경에 따라 필요한 학습 내용이 달라질 수 있습니다.
          </p>

        </div>
      </section>

      {/* 교육의 특징 */}
      <section className="max-w-6xl mx-auto px-6 py-14">

        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 text-center mb-10">
          ROKMUN이 추구하는 한국어교육
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="border border-blue-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              체류 목적 중심
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              유학, 취업, 가족생활, 정착 등 학습자의
              실제 체류 목적에 맞는 교육을 지향합니다.
            </p>
          </div>

          <div className="border border-blue-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              실제 생활 중심
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              일상생활과 사회적 활동에서 한국어로
              필요한 과제를 수행하는 능력을 중시합니다.
            </p>
          </div>

          <div className="border border-blue-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              지속적인 성장
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              체류 과정에서 변화하는 학습 요구와
              한국어 능력의 성장을 함께 지원하고자 합니다.
            </p>
          </div>

        </div>
      </section>

      {/* 교육과정 준비 안내 */}
      <section className="bg-blue-50 border-t border-blue-100 py-14">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium rounded-full px-4 py-2 mb-5">
            교육과정 준비 중
          </span>

          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-5">
            ROKMUN과 함께 시작하는 한국 생활
          </h2>

          <p className="text-gray-600 leading-relaxed mb-8">
            체류 단계 기반 한국어교육의 단계별 교육과정을
            준비하고 있습니다.
            <br />
            지금은 한국어 튜터링을 통해
            나에게 맞는 한국어 학습을 시작할 수 있습니다.
          </p>

          <div className="flex flex-wrap justify-center gap-4">

            <Link
              to="/tutors"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-lg transition-colors"
            >
              한국어 튜터 찾아보기
            </Link>

            <Link
              to="/"
              className="bg-white border border-blue-600 text-blue-700 hover:bg-blue-100 font-semibold px-7 py-3 rounded-lg transition-colors"
            >
              ROKMUN 홈으로
            </Link>

          </div>

        </div>
      </section>

      

    </main>
  );
}