import { useEffect, useState } from 'react';
import { X, Camera } from 'lucide-react';
import { getClient } from '../../services/apiService';
import MapView from '../MapView/MapView';

interface DetalhesOcorrenciaModalProps {
  ocorrencia: any;
  onClose: () => void;
  onEdit: () => void;
}

export default function DetalhesOcorrenciaModal({
  ocorrencia,
  onClose,
  onEdit,
}: DetalhesOcorrenciaModalProps) {
  const [detalhes, setDetalhes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [midias, setMidias] = useState<string[]>([]);

  useEffect(() => {
    carregarDetalhes();
  }, [ocorrencia.id_ocorrencia]);

  const carregarDetalhes = async () => {
    try {
      const client = getClient();
      
      // Buscar todas as listas
      const [subgruposData, gruposData, naturezasData, bairrosData, municipiosData, formasAcervoData] = await Promise.all([
        client.adminSubgrupos.getApiv3Subgrupos(),
        client.adminGrupos.getApiv3Grupos(),
        client.adminNaturezas.getApiv3Naturezas(),
        client.adminBairros.getApiv3Bairros(),
        client.adminMunicPios.getApiv3Municipios(),
        client.adminFormasDeAcervo.getApiv3FormasAcervo(),
      ]);

      // Encontrar os dados específicos
      const subgrupo = subgruposData.find((s: any) => s.id_subgrupo === ocorrencia.id_subgrupo_fk);
      const grupo = gruposData.find((g: any) => g.id_grupo === subgrupo?.id_grupo_fk);
      const natureza = naturezasData.find((n: any) => n.id_natureza === grupo?.id_natureza_fk);
      const bairro = bairrosData.find((b: any) => b.id_bairro === ocorrencia.id_bairro_fk);
      const municipio = municipiosData.find((m: any) => m.id_municipio === bairro?.id_municipio_fk);
      const formaAcervo = formasAcervoData.find((f: any) => f.id_forma_acervo === ocorrencia.id_forma_acervo_fk);

      setDetalhes({
        natureza: natureza?.descricao,
        grupo: grupo?.descricao_grupo,
        subgrupo: subgrupo?.descricao_subgrupo,
        formaAcervo: formaAcervo?.descricao,
        municipio: municipio?.nome_municipio,
        bairro: bairro?.nome_bairro,
      });
      
      // Buscar mídias da ocorrência (assumindo que vem no objeto ou precisa fazer request separado)
      // Se a ocorrência tiver um array de mídias
      if (ocorrencia.midias && Array.isArray(ocorrencia.midias)) {
        setMidias(ocorrencia.midias);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      PENDENTE: { label: 'PENDENTE', bg: 'bg-yellow-100', text: 'text-yellow-700' },
      EM_ANDAMENTO: { label: 'EM ANDAMENTO', bg: 'bg-blue-100', text: 'text-blue-700' },
      CONCLUIDO: { label: 'CONCLUÍDO', bg: 'bg-green-100', text: 'text-green-700' },
      CANCELADO: { label: 'CANCELADO', bg: 'bg-red-100', text: 'text-red-700' },
    };
    return configs[status as keyof typeof configs] || configs.PENDENTE;
  };

  const statusConfig = getStatusConfig(ocorrencia.status_situacao);

  const formatarData = (dataISO: string) => {
    if (!dataISO) return '-';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-semibold text-[#0a1c3e]">Detalhes da Ocorrência</h2>
            <p className="text-sm text-gray-500">Ocorrência #{ocorrencia.nr_aviso || 'N/A'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando detalhes...</div>
        ) : (
          <div className="p-6">
            {/* Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Esquerda - Mapa */}
              <div className="lg:col-span-1">
                <div className="h-[280px] rounded-xl overflow-hidden border border-gray-200">
                  <MapView
                    municipio={detalhes?.municipio}
                    bairro={detalhes?.bairro}
                  />
                </div>
                <div className="mt-3 text-center text-xs text-gray-600">
                  {detalhes?.bairro && detalhes?.municipio
                    ? `${detalhes.bairro}, ${detalhes.municipio}`
                    : 'Mapa da localização da ocorrência'}
                </div>

                {/* Mídias */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-[#0a1c3e] mb-3">
                    Mídias (Fotos e Vídeos)
                  </h3>
                  {midias.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {midias.map((midia, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                        >
                          <img
                            src={midia}
                            alt={`Mídia ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Coluna Direita - Informações */}
              <div className="lg:col-span-2">
                <h3 className="text-sm font-semibold text-[#0a1c3e] mb-4">
                  Informações Principais
                </h3>

                {/* Grid de 2 colunas para as informações */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {/* Status */}
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      Status
                    </label>
                    <div className="mt-1">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Nr Aviso */}
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      Nº Aviso
                    </label>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {ocorrencia.nr_aviso || '-'}
                    </div>
                  </div>

                  {/* Natureza */}
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      Natureza
                    </label>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {detalhes?.natureza}
                    </div>
                  </div>

                  {/* Grupo */}
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      Grupo
                    </label>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {detalhes?.grupo}
                    </div>
                  </div>

                  {/* Subgrupo */}
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      Subgrupo
                    </label>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {detalhes?.subgrupo}
                    </div>
                  </div>

                  {/* Data Acionamento */}
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      Data Acionamento
                    </label>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {formatarData(ocorrencia.data_acionamento)}
                    </div>
                  </div>

                  {/* Data Execução Serviço */}
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      Data Execução Serviço
                    </label>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {formatarData(ocorrencia.data_execucao_servico)}
                    </div>
                  </div>

                  {/* Relacionado à Eleição */}
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      Relacionado à Eleição
                    </label>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {ocorrencia.relacionado_eleicao ? 'Sim' : 'Não'}
                    </div>
                  </div>

                  {/* Município */}
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      Município
                    </label>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {detalhes?.municipio || '-'}
                    </div>
                  </div>

                  {/* Bairro */}
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      Bairro
                    </label>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {detalhes?.bairro || '-'}
                    </div>
                  </div>
                </div>

                {/* Equipes e Viaturas */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-[#0a1c3e] mb-3">
                    Equipes e Viaturas Envolvidas
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-gray-700">Viatura ABT-01</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Equipe A · Comandante João Silva
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-gray-700">Viatura AR-02</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Equipe B · Comandante Maria Santos
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão Editar */}
                <div className="mt-8">
                  <button
                    onClick={onEdit}
                    className="w-full bg-[#4169E1] hover:bg-[#3557c7] text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Editar Ocorrência
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
