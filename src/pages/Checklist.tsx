import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, FileSignature, ClipboardCheck, Wallet } from 'lucide-react';
const guias=[
 {id:'empenho',n:'01',titulo:'Emissão de Empenho',descricao:'Análise do SEI, conferência da dotação, elaboração da minuta e emissão da Nota de Empenho.',Icon:FileSignature},
 {id:'liquidacao',n:'02',titulo:'Liquidação da Despesa',descricao:'Conferência de notas fiscais, ateste, regularidade, retenções e registro no SIAFI.',Icon:ClipboardCheck},
 {id:'pagamento',n:'03',titulo:'Realização de Pagamentos',descricao:'Disponibilidade financeira, gerenciamento de compromissos, execução e comprovantes.',Icon:Wallet}
];
export default function Checklist(){return <div className="mx-auto max-w-5xl space-y-7 pb-10">
 <header><p className="text-sm font-semibold text-blue-700">SGOF • HU-UFCAT</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Guia Operacional</h1><p className="mt-3 max-w-3xl text-slate-600">Procedimentos padronizados para as três etapas da execução da despesa, adaptados dos POPs de referência do HULW/UFPB.</p></header>
 <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><div className="flex items-start gap-3"><BookOpenCheck className="shrink-0 text-blue-700"/><p className="text-sm leading-6 text-slate-700">Escolha um procedimento, siga as etapas na ordem, confira os pontos de atenção e marque a conclusão. As telas existentes permanecem acessíveis pelo botão <strong>Ver tela</strong>. As marcações são locais ao navegador.</p></div></section>
 <div className="grid gap-4 md:grid-cols-3">{guias.map(g=><Link key={g.id} to={'/checklist/'+g.id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"><div className="flex items-center justify-between"><g.Icon className="text-blue-700" size={27}/><span className="text-2xl font-bold text-slate-200">{g.n}</span></div><h2 className="mt-5 text-lg font-bold text-slate-900">{g.titulo}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{g.descricao}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">Abrir procedimento <ArrowRight size={16}/></span></Link>)}</div>
 <p className="text-xs text-slate-500">Fontes: POP.UEOF.001, POP.UEOF.002 e POP.UEOF.003 (HULW/UFPB, 2022). Conteúdo adaptado para consulta no HU-UFCAT; fluxos, parâmetros e normas locais devem ser validados antes da aplicação.</p>
 </div>}
