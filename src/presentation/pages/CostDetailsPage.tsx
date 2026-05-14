import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCosts } from '../../application/hooks/useCosts';
import { useProjects } from '../../application/hooks/useProjects';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { ArrowLeft, Calendar, Tag, CreditCard, CircleDollarSign, FileText, Clock, Package } from 'lucide-react';

export const CostDetailsPage: React.FC = () => {
  const { projectId, costId } = useParams<{ projectId: string; costId: string }>();
  const { projects } = useProjects();
  const { getCostById } = useCosts(projectId || '');
  const navigate = useNavigate();

  const project = projects.find(p => p.id === projectId);
  const cost = getCostById(costId || '');

  if (!project || !cost) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Custo não encontrado</h2>
        <Link to={`/project/${projectId}`} className="mt-4 inline-block text-primary-600 hover:text-primary-700">
          <ArrowLeft className="inline mr-2" size={16} /> Voltar para obra
        </Link>
      </div>
    );
  }

  const statusStyles: Record<string, string> = {
    'Pago': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Pendente': 'bg-rose-100 text-rose-800 border-rose-200',
    'Parcial': 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    'Material': <Package size={20} />,
    'Mão de Obra': <Tag size={20} />,
    'Equipamento': <Tag size={20} />,
    'Transporte': <Tag size={20} />,
    'Alimentação': <Tag size={20} />,
    'Outros': <Tag size={20} />,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/project/${projectId}`)}
          className="p-2 bg-white rounded-full shadow-sm text-slate-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <p className="text-sm text-slate-500">{project.name}</p>
          <h1 className="text-2xl font-bold text-slate-900">Detalhes do Custo</h1>
        </div>
      </div>

      {/* Main Info Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
          <p className="text-primary-100 text-sm font-medium mb-1">Descrição</p>
          <h2 className="text-2xl font-bold">{cost.name}</h2>
          <div className="mt-4 flex items-center gap-3">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${statusStyles[cost.paymentStatus]}`}>
              {cost.paymentStatus}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Valor */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
                <CircleDollarSign size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Valor</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{formatCurrency(cost.value)}</p>
              </div>
            </div>

            {/* Categoria */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
                {categoryIcons[cost.category] || <Tag size={22} />}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Categoria</p>
                <p className="text-lg font-semibold text-slate-900 mt-0.5">{cost.category}</p>
              </div>
            </div>

            {/* Forma de Pagamento */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-lg">
                <CreditCard size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Forma de Pagamento</p>
                <p className="text-lg font-semibold text-slate-900 mt-0.5">{cost.paymentMethod}</p>
              </div>
            </div>

            {/* Status do Pagamento */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="p-2.5 bg-amber-100 text-amber-600 rounded-lg">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status do Pagamento</p>
                <p className="text-lg font-semibold text-slate-900 mt-0.5">{cost.paymentStatus}</p>
              </div>
            </div>

            {/* Data */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg">
                <Calendar size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Data</p>
                <p className="text-lg font-semibold text-slate-900 mt-0.5">
                  {new Date(cost.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* ID */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="p-2.5 bg-slate-200 text-slate-600 rounded-lg">
                <FileText size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">ID do Registro</p>
                <p className="text-xs font-mono text-slate-600 mt-1 break-all">{cost.id}</p>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-slate-500" />
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Observações</p>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {cost.observations || 'Nenhuma observação registrada.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => navigate(`/project/${projectId}`)}>
          <ArrowLeft size={16} className="mr-2" /> Voltar
        </Button>
        <Button onClick={() => navigate(`/project/${projectId}?edit=${cost.id}`)}>
          Editar este custo
        </Button>
      </div>
    </div>
  );
};
