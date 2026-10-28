import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ClipboardCheck, FileText, Landmark, Monitor, ShieldAlert } from 'lucide-react';

const etapas = [
  { titulo: 'Conferência da instrução no SEI', descricao: 'Abra a instrução de pagamento no SEI e confira fornecedor, valor do pagamento e retenções, quando houver.', conferencia: 'Não avance se o fornecedor ou o valor não corresponder à instrução de pagamento.' },
  { titulo: 'Identificação da tag no processo', descricao: 'Localize a tag vermelha GEROP emitida e anote os números da Nota de Pagamento (NP) e da Ordem Bancária (OP).', conferencia: 'Tenha em mãos os números da NP e da OP.' },
  { titulo: 'Consulta no SIAFI Web', descricao: 'Acesse a consulta de Documento Hábil (CONDH) no SIAFI Web e consulte os documentos identificados no SEI.', conferencia: 'Confira unidade gestora, favorecido e valor do pagamento.' },
  { titulo: 'Salvamento da Nota de Pagamento', descricao: 'Consulte os dados da NP no SIAFI em tela preta e salve o arquivo para inclusão no SEI. Nome sugerido: NP[número da NP][fornecedor].pdf.', conferencia: 'Confirme que o arquivo está salvo, legível e completo.' },
  { titulo: 'Inclusão dos documentos no SEI', descricao: 'No processo correto, inclua o comprovante de pagamento, a Nota de Pagamento e o despacho. Confira o tipo documental, a descrição e a ordem.', conferencia: 'Abra os anexos para confirmar que estão completos, legíveis e vinculados ao processo correto.' },
  { titulo: 'Encaminhamento para assinatura', descricao: 'Após inserir os documentos, altere o marcador do processo para a tag verde PARA ASSINATURA – SGOF.', conferencia: 'Confirme que o processo está marcado para assinatura da SGOF.' },
];

const verificacoes = [
  'Fornecedor e valor conferidos no SEI',
  'Retenções verificadas, quando aplicável',
  'Números da NP e da OP identificados',
  'Documento hábil consultado no SIAFI Web — CONDH',
  'Arquivo da NP salvo e legível',
  'Comprovante de pagamento anexado ao SEI',
  'Despacho incluído no processo',
  'Tag alterada para PARA ASSINATURA – SGOF',
];

export default function InserirComprovantePagamento() {
  const [marcados, setMarcados] = useState<number[]>([]);
  const [telas, setTelas] = useState<Record<number, string>>({});
  const [ampliada, setAmpliada] = useState<string | null>(null);
  useEffect(() => {
    let ativo = true;
    void (async () => {
      const resultado: Record<number, string> = {};
      for (const pagina of [3, 4, 5, 6, 7, 8]) {
        const { data } = await supabase.storage.from('pops-privados')
          .createSignedUrl('inserir-comprovante/tela-' + pagina + '.webp', 300);
        if (data?.signedUrl) resultado[pagina] = data.signedUrl;
      }
      if (ativo) setTelas(resultado);
    })();
    return () => { ativo = false; };
  }, []);
  const alternar = (indice: number) => setMarcados(anteriores =>
    anteriores.includes(indice) ? anteriores.filter(i => i !== indice) : [...anteriores, indice]
  );
  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-10">
      <Link to="/checklist" className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"><ArrowLeft size={16} /> Voltar ao Guia Operacional</Link>
      <header>
        <p className="text-sm font-semibold text-blue-600">Guia Operacional / Pagamento</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Inserção de Comprovante de Pagamento no SEI</h1>
        <p className="mt-3 text-slate-600">Procedimento de consulta, salvamento e inclusão do comprovante no processo do SEI até o encaminhamento para assinatura da SGOF.</p>
        <p className="mt-2 text-xs text-slate-500">Fonte: POP – Inserir Comprovante • Guia revisado em 14/09/2026</p>
      </header>
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-center gap-2 font-semibold text-blue-900"><Landmark size={20}/> Resultado esperado</div>
        <p className="mt-2 text-sm text-slate-700">Processo no SEI com comprovante de pagamento, despacho correspondente e tag verde <strong>PARA ASSINATURA – SGOF</strong>.</p>
      </div>
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Passo a passo</h2>
        {etapas.map((etapa, indice) => (
          <article key={etapa.titulo} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">{indice + 1}</span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{etapa.titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{etapa.descricao}</p>
                {telas[indice + 3] && (
                  <button type="button" onClick={() => setAmpliada(telas[indice + 3])} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                    <Monitor size={16} /> Ver tela do procedimento
                  </button>
                )}
                <div className="mt-4 flex gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                  <ShieldAlert className="mt-0.5 shrink-0 text-amber-600" size={18}/>
                  <span><strong>Conferência:</strong> {etapa.conferencia}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><ClipboardCheck size={21} /> Checklist de conclusão</h2>
          <span className="text-sm font-semibold text-blue-700">{marcados.length} de {verificacoes.length} conferidos</span>
        </div>
        <div className="mt-4 space-y-3">
          {verificacoes.map((texto, indice) => (
            <label key={texto} className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-slate-50">
              <input type="checkbox" checked={marcados.includes(indice)} onChange={() => alternar(indice)} className="mt-1 h-4 w-4 accent-blue-600"/>
              <span className="text-sm text-slate-700">{texto}</span>
            </label>
          ))}
        </div>
        {marcados.length === verificacoes.length && <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"><CheckCircle2 size={18}/> Checklist concluído. Confira o processo antes de encaminhar.</p>}
      </section>
      {ampliada && <div role="dialog" aria-modal="true" aria-label="Tela ampliada" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 p-4" onClick={() => setAmpliada(null)}><button type="button" className="mb-3 self-end rounded-lg bg-white px-4 py-2 font-semibold" onClick={() => setAmpliada(null)}>Fechar</button><img src={ampliada} alt="Tela original ampliada" className="max-h-[85vh] max-w-full object-contain"/></div>}
      <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><FileText size={20} className="shrink-0"/> Em caso de divergência entre os documentos, interrompa o fluxo e solicite orientação à unidade responsável.</div>
    </div>
  );
}
