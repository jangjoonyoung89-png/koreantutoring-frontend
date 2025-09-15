import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function VideoClassPage() {
  const { bookingId } = useParams();
  const { user } = useContext(AuthContext);

  const [classInfo,setClassInfo] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const [canEnter,setCanEnter] = useState(false);

  useEffect(()=>{
    const fetchClass = async ()=>{
      try{
        const res = await axios.get(`http://localhost:8000/api/bookings/${bookingId}`,{
          headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}
        });
        const data = res.data;
        if(!user){ setError("로그인 필요"); setLoading(false); return; }
        const authorized = (user.role==="student" && user._id===data.studentId)
                        || (user.role==="tutor" && user._id===data.tutorId);
        if(!authorized){ setError("접근 권한 없음"); setLoading(false); return; }

        setClassInfo(data);
        const now = new Date();
        const startTime = new Date(data.time);
        if(now>=startTime) setCanEnter(true);
        setLoading(false);
      }catch(err){ setError("수업 불러오기 오류"); setLoading(false); }
    };
    fetchClass();
  },[bookingId,user]);

  if(loading) return <p style={{textAlign:"center",marginTop:50}}>로딩 중...</p>;
  if(error) return <p style={{color:"red",textAlign:"center",marginTop:50}}>{error}</p>;
  if(!classInfo) return null;

  const { tutorName, studentName, time, roomId } = classInfo;
  const jitsiUrl = `https://meet.jit.si/${roomId}`;

  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:20}}>
      <h2 style={{fontSize:"1.5rem",fontWeight:"bold",marginBottom:20}}>🧑‍🏫 실시간 수업</h2>
      <p><strong>학생:</strong> {studentName}</p>
      <p><strong>튜터:</strong> {tutorName}</p>
      <p><strong>시간:</strong> {new Date(time).toLocaleString()}</p>

      <button
        onClick={()=>window.open(jitsiUrl,"_blank","width=1280,height=800")}
        disabled={!canEnter}
        style={{
          padding:"12px 24px", fontSize:"1rem", borderRadius:8,
          backgroundColor: canEnter?"#2563eb":"#ccc", color:"white", border:"none",
          cursor: canEnter?"pointer":"not-allowed", marginTop:20
        }}
      >
        {canEnter?"수업 입장하기":"입장 가능 시간 전"}
      </button>

      {canEnter && (
        <div style={{border:"1px solid #ccc",borderRadius:8,overflow:"hidden",marginTop:20}}>
          <iframe
            src={jitsiUrl}
            allow="camera; microphone; fullscreen; display-capture"
            style={{width:"100%",height:"600px",border:"none"}}
            title="화상 수업"
          />
        </div>
      )}
    </div>
  );
}