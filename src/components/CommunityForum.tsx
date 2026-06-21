import React, { useState } from 'react';
import { SpecimenTestTile, Comment } from '../types';
import { Eye, Heart, MessageSquare, Plus, Send, X, Flame, Coffee, FileText, User, Calendar, PlusCircle, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';

interface CommunityForumProps {
  specimens: SpecimenTestTile[];
  setSpecimens: React.Dispatch<React.SetStateAction<SpecimenTestTile[]>>;
}

export default function CommunityForum({ specimens, setSpecimens }: CommunityForumProps) {
  const [activeTile, setActiveTile] = useState<SpecimenTestTile | null>(null);
  const [filterGasElectric, setFilterGasElectric] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New Specimen parameters
  const [newTile, setNewTile] = useState({
    title: '',
    author: '',
    clayBody: '백자청토 (Buncheong)',
    glazeName: '',
    firingType: '산화채성 (Oxidation)' as any,
    firingTemp: '1240°C',
    coneValue: 'Cone 6',
    description: '',
    knowHowTips: ''
  });

  // Comment input
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpecimens(prev => prev.map(tile => {
      if (tile.id === id) {
        return { ...tile, likes: tile.likes + 1 };
      }
      return tile;
    }));
    // Sync active tile modal
    if (activeTile?.id === id) {
      setActiveTile(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !activeTile) return;

    const authorName = commentAuthor.trim() || '익명 도예가';
    const added: Comment = {
      id: `comm-${Date.now()}`,
      author: authorName,
      content: commentContent,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSpecimens(prev => prev.map(tile => {
      if (tile.id === activeTile.id) {
        const updatedTile = {
          ...tile,
          comments: [...tile.comments, added]
        };
        setActiveTile(updatedTile);
        return updatedTile;
      }
      return tile;
    }));

    setCommentContent('');
  };

  const handleCreateSpecimen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTile.title.trim() || !newTile.author.trim()) return;

    const created: SpecimenTestTile = {
      id: `tile-${Date.now()}`,
      title: newTile.title,
      author: newTile.author,
      clayBody: newTile.clayBody,
      glazeName: newTile.glazeName || '투명 무색유',
      firingType: newTile.firingType,
      firingTemp: newTile.firingTemp,
      coneValue: newTile.coneValue,
      description: newTile.description,
      knowHowTips: newTile.knowHowTips,
      likes: 5,
      comments: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSpecimens(prev => [created, ...prev]);
    // Reset Form
    setNewTile({
      title: '',
      author: '',
      clayBody: '백자청토 (Buncheong)',
      glazeName: '',
      firingType: '산화채성 (Oxidation)',
      firingTemp: '1240°C',
      coneValue: 'Cone 6',
      description: '',
      knowHowTips: ''
    });
    setShowAddForm(false);
  };

  // Filter gas electrical
  const filteredSpecimens = specimens.filter(tile => {
    if (filterGasElectric === 'All') return true;
    if (filterGasElectric === 'Oxidation') return tile.firingType.includes('산화');
    if (filterGasElectric === 'Reduction') return tile.firingType.includes('환원');
    return true;
  });

  return (
    <div className="space-y-6" id="community-forum">
      {/* Intro Panel */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col md:flex-row items-stretch justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-1.5">
            <Coffee className="w-5 h-5 text-[#b76e66]" /> 도예 시편 & 레시피 나눔방
          </h2>
          <p className="text-stone-500 text-xs">
            다양한 태토 위에 시유된 유약 발색, 가마 상태별 오버레이, 안료 혼합의 소성 결과를 투명하게 기록하고 대조해 완성율을 보정해주는 창작 공유망입니다.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-full transition-colors inline-flex items-center gap-1.5 self-center cursor-pointer"
          id="post-specimen-btn"
        >
          {showAddForm ? '게시 시편 목록 보기' : '＋ 내 연구 시편 등록'}
        </button>
      </div>

      {showAddForm ? (
        /* STUDY TILE PUBLISH FORM */
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs" id="add-specimen-form-panel">
          <div className="border-b border-stone-150 pb-3 mb-5">
            <h3 className="font-serif text-base font-bold text-stone-900">내 가마 시편 결과물 출간</h3>
            <p className="text-stone-500 text-xs text-stone-400">다른 작가님들의 실패 방지를 돕기 위해, 소성 환경과 핵심 번짐 방지 팁을 명문화해 공유해 주십시오.</p>
          </div>

          <form onSubmit={handleCreateSpecimen} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">시편 소제목</label>
                <input
                  type="text"
                  required
                  placeholder="예: 분청토 위에 올린 가마 황토 시편"
                  value={newTile.title}
                  onChange={(e) => setNewTile({ ...newTile, title: e.target.value })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">글쓴이 닉네임</label>
                <input
                  type="text"
                  required
                  placeholder="예: 백자사랑, 홍대도공"
                  value={newTile.author}
                  onChange={(e) => setNewTile({ ...newTile, author: e.target.value })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">사용 점토 (Clay Body)</label>
                <input
                  type="text"
                  placeholder="예: 소백토, B-Mix 5, 옹기토 등"
                  value={newTile.clayBody}
                  onChange={(e) => setNewTile({ ...newTile, clayBody: e.target.value })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">사용된 유약 구성 및 시유법</label>
                <input
                  type="text"
                  placeholder="예: Amaco Honey flux 2겹 + 스모키그레이 1겹 붓시유"
                  value={newTile.glazeName}
                  onChange={(e) => setNewTile({ ...newTile, glazeName: e.target.value })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">가마 소성 환경 (Firing Environment)</label>
                <select
                  value={newTile.firingType}
                  onChange={(e) => setNewTile({ ...newTile, firingType: e.target.value as any })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
                >
                  <option value="산화채성 (Oxidation)">전가마 전동 산화 (Oxidation)</option>
                  <option value="환원채성 (Reduction)">가스가마 불꽃 환원 (Reduction)</option>
                  <option value="라쿠 (Raku)">라쿠 가마 특수소성 (Raku)</option>
                  <option value="장작가마 (Wood Fired)">전통 장작가마 (Wood Fired)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 block">측정 최고 온도</label>
                  <input
                    type="text"
                    placeholder="예: 1240°C"
                    value={newTile.firingTemp}
                    onChange={(e) => setNewTile({ ...newTile, firingTemp: e.target.value })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 block">대응 가마 꼬깔 (Cone 번호)</label>
                  <input
                    type="text"
                    placeholder="예: Cone 6"
                    value={newTile.coneValue}
                    onChange={(e) => setNewTile({ ...newTile, coneValue: e.target.value })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 block">전반 실험 발색 및 가마 결과 묘사</label>
              <textarea
                required
                placeholder="유약 흘러내림 정도, 가마 서냉 속도, 기물 표면의 기포나 요철 현상을 상세하게 기술해 주세요."
                value={newTile.description}
                onChange={(e) => setNewTile({ ...newTile, description: e.target.value })}
                rows={3}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 block">핵심 성형/소성 제작 비법 노하우 (Key Tips)</label>
              <textarea
                required
                placeholder="시유할 때 바닥 수영선 예방 꿀팁이나, 특정 코발트 수성 농도 조언 등을 공유해 주십시오."
                value={newTile.knowHowTips}
                onChange={(e) => setNewTile({ ...newTile, knowHowTips: e.target.value })}
                rows={2}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-full transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#b76e66] hover:bg-[#a05a53] text-white font-bold text-xs rounded-full transition-colors flex items-center gap-1"
                id="submit-specimen-btn"
              >
                <Plus className="w-4 h-4" /> 게시판 공유 완료
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* MAIN LIST DECKS WITH FILTERS */
        <div className="space-y-4">
          <div className="flex bg-stone-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setFilterGasElectric('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterGasElectric === 'All' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
            >
              전체 시편 ({specimens.length})
            </button>
            <button
              onClick={() => setFilterGasElectric('Oxidation')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterGasElectric === 'Oxidation' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
            >
              전기/산화 가마 ({specimens.filter(s => s.firingType.includes('산화')).length})
            </button>
            <button
              onClick={() => setFilterGasElectric('Reduction')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterGasElectric === 'Reduction' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
            >
              가스/환원 가마 ({specimens.filter(s => s.firingType.includes('환원')).length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredSpecimens.map(tile => {
              // Generate beautiful CSS abstract graphic for the test tile based on glaze and clay name to make it tactile & gorgeous!
              const isDarkBody = tile.clayBody.toLowerCase().includes('분청') || tile.clayBody.toLowerCase().includes('dark') || tile.clayBody.toLowerCase().includes('옹기');
              const isReduction = tile.firingType.includes('환원');
              const containerBg = isDarkBody ? 'bg-stone-800' : 'bg-stone-50';
              const ringBorderClr = isReduction ? 'border-[#cff9fb]/80 shadow-[0_0_10px_rgba(207,249,251,0.3)]' : 'border-[#b76e66]/80';
              const centerFillBg = tile.glazeName.toLowerCase().includes('blue')
                ? 'bg-[#cff9fb]/70'
                : tile.glazeName.toLowerCase().includes('황') || tile.glazeName.toLowerCase().includes('honey')
                ? 'bg-[#e3a692]/70'
                : 'bg-stone-300';

              return (
                <div
                  key={tile.id}
                  onClick={() => setActiveTile(tile)}
                  className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(183,110,102,0.12)] hover:-translate-y-2 hover:shadow-[0_12px_28px_rgba(183,110,102,0.32)] hover:border-[#b76e66]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  id={`specimen-card-${tile.id}`}
                >
                  {/* Test-Tile Virtual Graphic Header representing the real glaze outcome */}
                  <div className={`p-6 ${containerBg} h-36 flex items-center justify-center relative border-b border-stone-150`}>
                    <div className="absolute top-2 left-2 flex gap-1 items-center">
                      <span className="bg-stone-900/80 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-mono uppercase font-bold tracking-wide">
                        {tile.coneValue}
                      </span>
                      <span className="bg-[#b76e66] text-white text-[9px] px-1.5 py-0.5 rounded-sm font-bold font-mono">
                        {tile.firingTemp}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <Bookmark className="w-4 h-4 text-stone-400 hover:text-[#b76e66] transition-colors" />
                    </div>

                    {/* Fired Ceramic Ring representation */}
                    <div className={`w-20 h-20 rounded-full border-8 ${ringBorderClr} ${centerFillBg} flex items-center justify-center shadow-inner transition-transform hover:scale-105`}>
                      <span className="text-[10px] uppercase tracking-tighter text-white font-mono font-bold">TILE</span>
                    </div>
                  </div>

                  {/* Text card content */}
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#7a3f39] uppercase block tracking-wider">{tile.firingType}</span>
                      <h3 className="font-serif font-bold text-stone-900 text-base line-clamp-1 hover:text-[#b76e66]">{tile.title}</h3>
                    </div>

                    <div className="text-xs text-stone-500 space-y-1 font-medium bg-stone-50 p-2.5 rounded-lg border border-stone-200/50">
                      <div><span className="text-stone-400 text-[10px]">바 디:</span> {tile.clayBody}</div>
                      <div className="truncate"><span className="text-stone-400 text-[10px]">유 약:</span> {tile.glazeName}</div>
                    </div>

                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                      {tile.description}
                    </p>
                  </div>

                  {/* Foot metadata */}
                  <div className="p-4 border-t border-stone-100 flex items-center justify-between text-stone-400 text-[11px]">
                    <span className="font-medium inline-flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> {tile.author.split(' (')[0]}
                    </span>
                    
                    <div className="flex gap-2.5">
                      <button
                        onClick={(e) => handleLike(tile.id, e)}
                        className="flex items-center gap-1 hover:text-[#b76e66] transition-colors cursor-pointer"
                        id={`like-btn-${tile.id}`}
                      >
                        <Heart className="w-3.5 h-3.5" /> <span>{tile.likes}</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> <span>{tile.comments.length}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAILED SPECIMEN MODAL OVERLAY */}
      {activeTile && (
        <div className="fixed inset-0 bg-stone-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto block" id="specimen-detail-modal">
          <div className="bg-white rounded-xl border border-stone-200 max-w-2xl w-full max-h-[90vh] flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Modal Head */}
            <div className="p-5 border-b border-stone-150 flex justify-between items-center bg-stone-50">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#8a4940] uppercase tracking-widest">{activeTile.firingType} 소성 데이터 로그</span>
                <h3 className="font-serif text-lg font-bold text-stone-950">{activeTile.title}</h3>
              </div>
              <button
                onClick={() => setActiveTile(null)}
                className="p-1 px-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-200/50 transition-colors cursor-pointer"
                id="close-modal-btn"
              >
                닫기 <X className="w-4 h-4 inline" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-stone-700 flex-grow max-h-[60vh]">
              {/* Specification Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-stone-50 border border-stone-200 rounded p-3 text-center">
                  <span className="text-[10px] text-stone-400 font-bold block">소성 한계점</span>
                  <span className="text-xs font-bold text-stone-850 font-mono">{activeTile.firingTemp}</span>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded p-3 text-center">
                  <span className="text-[10px] text-stone-400 font-bold block">대응 꼬깔 Cone</span>
                  <span className="text-xs font-bold text-stone-850 font-mono">{activeTile.coneValue}</span>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded p-3 text-center col-span-2">
                  <span className="text-[10px] text-stone-400 font-bold block">작성 도예가</span>
                  <span className="text-xs font-semibold text-stone-850 truncate block">{activeTile.author}</span>
                </div>
              </div>

              {/* Clay & Glaze details */}
              <div className="space-y-2.5">
                <span className="text-stone-400 font-bold text-[10px] uppercase tracking-wider block">원재료 조합 배합 사서</span>
                <div className="p-4 rounded-lg bg-stone-50 border border-stone-225 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-[11px] font-bold text-stone-400 uppercase">점토 태토 (Clay Body)</h5>
                    <p className="text-xs font-bold text-stone-850 mt-1">{activeTile.clayBody}</p>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-stone-400 uppercase">시유 유약 (Glaze overlay)</h5>
                    <p className="text-xs font-bold text-stone-850 mt-1">{activeTile.glazeName}</p>
                  </div>
                </div>
              </div>

              {/* Description & Knowhow */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#b76e66]" /> 실험 가마 설명 & 발색 상태
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed bg-stone-50/50 p-3 rounded-lg border border-stone-150">
                    {activeTile.description}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#7a3f39] flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#b76e66]" /> 가마 공학 비법 및 소성 노하우 (Key Tips)
                  </h4>
                  <div className="text-xs text-[#7a3f39] leading-relaxed bg-[#fdf0ed] p-4 rounded-lg border border-[#e3a692]/50">
                    {activeTile.knowHowTips}
                  </div>
                </div>
              </div>

              {/* Interactive Comments Thread */}
              <div className="space-y-4 pt-4 border-t border-stone-150">
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-stone-400" /> 피드백 및 도예인 토론 ({activeTile.comments.length})
                </h4>

                <div className="space-y-3">
                  {activeTile.comments.map(comm => (
                    <div key={comm.id} className="bg-stone-50 p-3 rounded-lg border border-stone-150 space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-stone-800">{comm.author}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{comm.createdAt}</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">{comm.content}</p>
                    </div>
                  ))}
                </div>

                {/* Submit Comment mini-form */}
                <form onSubmit={handleAddComment} className="pt-2 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="닉네임"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      className="text-xs p-2.5 bg-white border border-stone-300 roundedlg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66]"
                    />
                    <div className="md:col-span-2 relative">
                      <input
                        type="text"
                        required
                        placeholder="실험 소감이나 질문을 작성해보세요..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="w-full text-xs p-2.5 pr-10 bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66]"
                        id="comment-content-input"
                      />
                      <button
                        type="submit"
                        className="absolute right-1 text-[#b76e66] hover:text-[#8a4940] py-1.5 px-2.5 top-1 cursor-pointer"
                        id="comment-submit-btn"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal Foot */}
            <div className="p-4 bg-stone-50 border-t border-stone-150 flex justify-between items-center text-xs">
              <button
                onClick={(e) => handleLike(activeTile.id, e)}
                className="px-4 py-2 bg-[#fdf0ed] hover:bg-[#f5ddd8] text-[#b76e66] font-semibold rounded-full border border-[#e3a692]/50 transition-colors cursor-pointer flex items-center gap-1.5"
                id="modal-like-btn"
              >
                <Heart className="w-4 h-4 fill-[#b76e66] text-[#b76e66]" /> 공감하기 ({activeTile.likes})
              </button>
              <button
                onClick={() => setActiveTile(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-full transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
