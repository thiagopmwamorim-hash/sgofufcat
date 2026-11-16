import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Monitor, X, RotateCcw, AlertTriangle } from 'lucide-react';
import { procedimentos } from '../data/procedimentos';
export default function ProcedimentoOperacional() {
  const { tipo } = useParams<{tipo:string}>();
  const pop = procedimentos[tipo || ''];
  const [concluidas, setConcluidas] = useState<number[]>([]);
  const [imagem, setImagem] = useState<string | null>(null);
  useEffect(() => {
    if (!pop) return;
    try {
      const valor: unknown = JSON.parse(localStorage.getItem('sgof-guia-v2-'+pop.id) || '[]');
      setConcluidas(Array.isArray(valor) ? valor.filter((v):v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < pop.etapas.length) : []);
    } catch { setConcluidas([]); }
  }, [pop?.id]);
  useEffect(() => {
    if (!pop) return;
    try { localStorage.setItem('sgof-guia-v2-'+pop.id, JSON.stringify(concluidas)); } catch { /* armazenamento opcional */ }
  }, [concluidas, pop?.id]);
  if (!pop) return <div className="p-6">Procedimento não encontrado. <Link to="/checklist">Voltar ao guia</Link></div>;
  const alternar = (n:number) => setConcluidas(v => v.includes(n) ? v.filter(x=>x!==n) : [...v,n]);
  return <div className="mx-auto max-w-5xl space-y-6 pb-12">
    <Link to="/checklist" className="inline-flex items-center gap-2 text-sm text-blue-700"><ArrowLeft size={16}/> Voltar ao Guia Operacional</Link>
    <header className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
      <p className="text-xs font-bold uppercase tracking-wide text-blue-700">SGOF • HU-UFCAT | Guia operacional</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{pop.titulo}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600"><strong>Objetivo:</strong> {pop.objetivo}</p>
      <p className="mt-3 text-sm text-slate-600"><strong>Sistemas:</strong> {pop.sistemas.join(' • ')}</p>
      <p className="mt-3 text-sm text-slate-600"><strong>Resultado esperado:</strong> {pop.resultado}</p>
    </header>
    <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
      <div className="flex flex-wrap justify-between items-center gap-3"><h2 className="font-bold text-blue-900">Progresso do procedimento</h2><span className="text-sm font-semibold text-blue-800">{concluidas.length} de {pop.etapas.length} etapas</span></div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100" role="progressbar" aria-label="Etapas concluídas" aria-valuenow={concluidas.length} aria-valuemin={0} aria-valuemax={pop.etapas.length}><div className="h-full bg-blue-600 transition-all" style={{width:((concluidas.length/pop.etapas.length)*100)+'%'}}/></div>
      <div className="mt-3 flex flex-wrap justify-between gap-3 text-xs text-slate-600"><span>Marcações salvas apenas neste navegador. Reinicie para cada novo processo.</span><button type="button" className="inline-flex items-center gap-1 font-semibold text-blue-700" onClick={()=>{if(window.confirm('Reiniciar todas as etapas deste POP?')) setConcluidas([]);}}><RotateCcw size={14}/> Reiniciar checklist</button></div>
    </section>
    <section className="space-y-4"><h2 className="text-xl font-bold text-slate-900">Passo a passo</h2>
      {pop.etapas.map((etapa,i)=><article key={etapa.titulo} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold">{String(i+1).padStart(2,'0')}</span>
        <div className="min-w-0 flex-1"><span className="text-xs font-semibold text-blue-600">{etapa.sistema}</span><h3 className="mt-1 text-lg font-bold text-slate-900">{etapa.titulo}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{etapa.descricao}</p>
          <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900"><strong>Conferência:</strong> {etapa.conferencia}</div>
          <div className="mt-4 flex flex-wrap items-center gap-4"><label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer"><input type="checkbox" className="h-4 w-4 accent-blue-600" checked={concluidas.includes(i)} onChange={()=>alternar(i)}/> Etapa concluída</label>
          {etapa.imagem && <button type="button" onClick={()=>setImagem(etapa.imagem || null)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"><Monitor size={16}/> Ver tela</button>}</div>
        </div></div></article>)}
    </section>
    {concluidas.length===pop.etapas.length && <p className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"><CheckCircle2 size={19}/> Todas as etapas foram marcadas. Confira o processo antes do encaminhamento.</p>}
    <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><div className="flex gap-2"><AlertTriangle size={18} className="shrink-0"/><div><strong>Adaptação institucional — validação necessária.</strong> {pop.observacao} Referência: {pop.codigo}, HULW/UFPB, versão de 2022. Este guia não substitui POP vigente ou validação da chefia.</div></div></aside>
    {imagem && <div role="dialog" aria-modal="true" aria-label="Tela do procedimento" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4" onClick={()=>setImagem(null)}><div className="max-h-[95vh] max-w-6xl" onClick={e=>e.stopPropagation()}><button type="button" onClick={()=>setImagem(null)} className="mb-3 ml-auto flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold"><X size={16}/> Fechar</button><img src={imagem} alt="Tela ilustrativa do procedimento" className="max-h-[85vh] max-w-full object-contain"/></div></div>}
  </div>;
}
