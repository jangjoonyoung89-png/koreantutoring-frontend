import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function QASection({ tutorId }) {
  const { user } = useContext(AuthContext);
  const [qas, setQAs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState({});

  useEffect(() => {
    fetchQAs();
  }, []);

  const fetchQAs = async () => {
    try {
      const res = await api.get(`/api/qa/tutor/${tutorId}`);
      setQAs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const submitQuestion = async () => {
    if (!question.trim()) return;
    try {
      await api.post("/api/qa", { tutorId, question });
      setQuestion("");
      fetchQAs();
    } catch (err) {
      console.error(err);
    }
  };

  const submitAnswer = async (qaId) => {
    if (!answer[qaId]?.trim()) return;
    try {
      await api.put(`/api/qa/${qaId}/answer`, { answer: answer[qaId] });
      setAnswer((prev) => ({ ...prev, [qaId]: "" }));
      fetchQAs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 mt-6">
      <h3 className="text-xl font-bold mb-2">Q&A</h3>

      {user?.role === "student" && (
        <div className="mb-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="튜터에게 질문을 남겨보세요."
            className="w-full border rounded p-2 mb-2"
          />
          <button
            onClick={submitQuestion}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            질문 등록
          </button>
        </div>
      )}

      <div>
        {qas.length === 0 ? (
          <p>질문이 아직 없습니다.</p>
        ) : (
          qas.map((qa) => (
            <div key={qa._id} className="border-b py-2">
              <p><strong>{qa.student.name}</strong> 질문: {qa.question}</p>
              {qa.answer ? (
                <p className="ml-4 text-green-700">답변: {qa.answer}</p>
              ) : (
                user?.role === "tutor" && (
                  <div className="ml-4 mt-1">
                    <input
                      type="text"
                      placeholder="답변 입력"
                      value={answer[qa._id] || ""}
                      onChange={(e) =>
                        setAnswer((prev) => ({ ...prev, [qa._id]: e.target.value }))
                      }
                      className="border rounded p-1 mr-2"
                    />
                    <button
                      onClick={() => submitAnswer(qa._id)}
                      className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                      답변 등록
                    </button>
                  </div>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}