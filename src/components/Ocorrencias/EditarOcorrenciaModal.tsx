import { useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';
import { getClient } from '../../services/apiService';
import SelectAutocomplete from '../SelectAutocomplete/SelectAutocomplete';
import MapView from '../MapView/MapView';
import type {
  Natureza,
  Grupo,
  Subgrupo,
  Municipio,
  Bairro,
} from '../../services/api';

interface EditarOcorrenciaModalProps {
  ocorrencia: any;
  onClose: () => void;
  onSave: () => void;
}

export default function EditarOcorrenciaModal({
  ocorrencia,
  onClose,
  onSave,
}: EditarOcorrenciaModalProps) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [naturezas, setNaturezas] = useState<Natureza[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [subgrupos, setSubgrupos] = useState<Subgrupo[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [gruposFiltrados, setGruposFiltrados] = useState<Grupo[]>([]);
  const [subgruposFiltrados, setSubgruposFiltrados] = useState<Subgrupo[]>([]);
  const [bairrosFiltrados, setBairrosFiltrados] = useState<Bairro[]>([]);
  const [midias, setMidias] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    id_natureza_fk: '',
    id_grupo_fk: '',
    id_subgrupo_fk: '',
    id_forma_acervo_fk: '',
    data_acionamento: '',
    hora_acionamento: '',
    data_execucao_servico: '',
    nr_aviso: '',
    id_municipio_fk: '',
    id_bairro_fk: '',
    status_situacao: 'PENDENTE',
    relacionado_eleicao: false,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (!loadingData) {
      carregarDadosOcorrencia();
    }
  }, [loadingData]);

  useEffect(() => {
    if (formData.id_natureza_fk) {
      const filtrados = grupos.filter((g) => g.id_natureza_fk === formData.id_natureza_fk);
      setGruposFiltrados(filtrados);
    } else {
      setGruposFiltrados([]);
    }
  }, [formData.id_natureza_fk, grupos]);

  useEffect(() => {
    if (formData.id_grupo_fk) {
      const filtrados = subgrupos.filter((s) => s.id_grupo_fk === formData.id_grupo_fk);
      setSubgruposFiltrados(filtrados);
    } else {
      setSubgruposFiltrados([]);
    }
  }, [formData.id_grupo_fk, subgrupos]);

  useEffect(() => {
    if (formData.id_municipio_fk) {
      const filtrados = bairros.filter((b) => b.id_municipio_fk === formData.id_municipio_fk);
      setBairrosFiltrados(filtrados);
    } else {
      setBairrosFiltrados([]);
    }
  }, [formData.id_municipio_fk, bairros]);

  const carregarDados = async () => {
    try {
      const client = getClient();
      const [naturezasData, gruposData, subgruposData, municipiosData, bairrosData] = await Promise.all([
        client.adminNaturezas.getApiv3Naturezas(),
        client.adminGrupos.getApiv3Grupos(),
        client.adminSubgrupos.getApiv3Subgrupos(),
        client.adminMunicPios.getApiv3Municipios(),
        client.adminBairros.getApiv3Bairros(),
      ]);
      setNaturezas(naturezasData || []);
      setGrupos(gruposData || []);
      setSubgrupos(subgruposData || []);
      setMunicipios(municipiosData || []);
      setBairros(bairrosData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const carregarDadosOcorrencia = async () => {
    try {
      const subgrupo = subgrupos.find((s) => s.id_subgrupo === ocorrencia.id_subgrupo_fk);
      const grupo = grupos.find((g) => g.id_grupo === subgrupo?.id_grupo_fk);
      const bairro = bairros.find((b) => b.id_bairro === ocorrencia.id_bairro_fk);
      const dataAcionamento = new Date(ocorrencia.data_acionamento);
      const data = dataAcionamento.toISOString().split('T')[0];
      const hora = dataAcionamento.toTimeString().slice(0, 5);
      
      const dataExecucao = ocorrencia.data_execucao_servico 
        ? new Date(ocorrencia.data_execucao_servico).toISOString().split('T')[0]
        : data;
      
      setFormData({
        id_natureza_fk: grupo?.id_natureza_fk || '',
        id_grupo_fk: subgrupo?.id_grupo_fk || '',
        id_subgrupo_fk: ocorrencia.id_subgrupo_fk || '',
        id_forma_acervo_fk: ocorrencia.id_forma_acervo_fk || '',
        data_acionamento: data,
        hora_acionamento: hora,
        data_execucao_servico: dataExecucao,
        nr_aviso: ocorrencia.nr_aviso || '',
        id_municipio_fk: bairro?.id_municipio_fk || '',
        id_bairro_fk: ocorrencia.id_bairro_fk || '',
        status_situacao: ocorrencia.status_situacao || 'PENDENTE',
        relacionado_eleicao: ocorrencia.relacionado_eleicao || false,
      });
      
      // Buscar mídias da ocorrência
      if (ocorrencia.midias && Array.isArray(ocorrencia.midias)) {
        setMidias(ocorrencia.midias);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da ocorrência:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      // Se mudou a natureza, resetar grupo e subgrupo
      if (name === 'id_natureza_fk') {
        newData.id_grupo_fk = '';
        newData.id_subgrupo_fk = '';
      }
      
      // Se mudou o grupo, resetar subgrupo
      if (name === 'id_grupo_fk') {
        newData.id_subgrupo_fk = '';
      }
      
      // Se mudou o município, resetar bairro
      if (name === 'id_municipio_fk') {
        newData.id_bairro_fk = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_subgrupo_fk || !formData.id_bairro_fk || !formData.id_forma_acervo_fk) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      const client = getClient();
      
      // Converter data_execucao_servico para formato datetime ISO
      const [ano, mes, dia] = formData.data_execucao_servico.split('-');
      const dataExecucao = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), 12, 0);
      const dataExecucaoISO = dataExecucao.toISOString();
      
      const ocorrenciaUpdate = {
        status_situacao: formData.status_situacao as any,
        nr_aviso: formData.nr_aviso || undefined,
        data_execucao_servico: dataExecucaoISO,
        relacionado_eleicao: formData.relacionado_eleicao,
      };
      
      console.log('ID da ocorrência:', ocorrencia.id_ocorrencia);
      console.log('Dados enviados para atualização:', ocorrenciaUpdate);
      
      await client.ocorrNcias.putApiv3Ocorrencias(ocorrencia.id_ocorrencia, ocorrenciaUpdate);
      alert('Ocorrência atualizada com sucesso!');
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Erro ao atualizar ocorrência:', error);
      console.error('Detalhes do erro:', error?.body);
      console.error('Body completo:', JSON.stringify(error?.body, null, 2));
      
      // Mostrar erros de validação específicos
      if (error?.body && Array.isArray(error.body)) {
        const erros = error.body.map((e: any) => `${e.path?.join('.')}: ${e.message}`).join('\n');
        alert(`Erro de validação:\n${erros}`);
      } else {
        alert(`Erro ao atualizar: ${error?.body?.message || error?.message || 'Tente novamente.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
    { value: 'CONCLUIDO', label: 'Concluído' },
    { value: 'CANCELADO', label: 'Cancelado' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-semibold text-[#0a1c3e]">Editar Ocorrência</h2>
            <p className="text-sm text-gray-500">Ocorrência #{ocorrencia.nr_aviso || 'N/A'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {loadingData ? (
          <div className="p-8 text-center text-gray-500">Carregando dados...</div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Esquerda - Mapa */}
              <div className="lg:col-span-1">
                <div className="h-[280px] rounded-xl overflow-hidden border border-gray-200">
                  <MapView municipio={municipios.find((m) => m.id_municipio === formData.id_municipio_fk)?.nome_municipio} bairro={bairros.find((b) => b.id_bairro === formData.id_bairro_fk)?.nome_bairro} />
                </div>
                <div className="mt-3 text-center text-xs text-gray-600">
                  {municipios.find((m) => m.id_municipio === formData.id_municipio_fk)?.nome_municipio && bairros.find((b) => b.id_bairro === formData.id_bairro_fk)?.nome_bairro
                    ? `${bairros.find((b) => b.id_bairro === formData.id_bairro_fk)?.nome_bairro}, ${municipios.find((m) => m.id_municipio === formData.id_municipio_fk)?.nome_municipio}`
                    : 'Selecione município e bairro'}
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

              {/* Coluna Direita - Formulário */}
              <div className="lg:col-span-2">
                <h3 className="text-sm font-semibold text-[#0a1c3e] mb-4">
                  Informações da Ocorrência
                </h3>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#0a1c3e] uppercase">Status</label>
                    <select name="status_situacao" value={formData.status_situacao} onChange={handleChange} className="w-full bg-[#f3f3f5] border-none rounded-lg px-3 py-2 text-sm" required>
                      {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#0a1c3e] uppercase">Nº Aviso</label>
                    <input type="text" name="nr_aviso" value={formData.nr_aviso} onChange={handleChange} placeholder="Ex: AV-DIA1-001" className="w-full bg-[#f3f3f5] border-none rounded-lg px-3 py-2 text-sm" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#0a1c3e] uppercase">Natureza</label>
                    <SelectAutocomplete name="id_natureza_fk" value={formData.id_natureza_fk} onChange={(value) => handleSelectChange('id_natureza_fk', value)} options={naturezas.map((n) => ({ value: n.id_natureza || '', label: n.descricao }))} placeholder="Selecione..." required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#0a1c3e] uppercase">Grupo</label>
                    <SelectAutocomplete name="id_grupo_fk" value={formData.id_grupo_fk} onChange={(value) => handleSelectChange('id_grupo_fk', value)} options={gruposFiltrados.map((g) => ({ value: g.id_grupo || '', label: g.descricao_grupo }))} placeholder="Selecione..." disabled={!formData.id_natureza_fk} required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#0a1c3e] uppercase">Subgrupo</label>
                    <SelectAutocomplete name="id_subgrupo_fk" value={formData.id_subgrupo_fk} onChange={(value) => handleSelectChange('id_subgrupo_fk', value)} options={subgruposFiltrados.map((s) => ({ value: s.id_subgrupo || '', label: s.descricao_subgrupo }))} placeholder="Selecione..." disabled={!formData.id_grupo_fk} required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#0a1c3e] uppercase">Data Acionamento</label>
                    <input type="date" name="data_acionamento" value={formData.data_acionamento} onChange={handleChange} className="w-full bg-[#f3f3f5] border-none rounded-lg px-3 py-2 text-sm" required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#0a1c3e] uppercase">Data Execução Serviço</label>
                    <input type="date" name="data_execucao_servico" value={formData.data_execucao_servico} onChange={handleChange} className="w-full bg-[#f3f3f5] border-none rounded-lg px-3 py-2 text-sm" required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#0a1c3e] uppercase">Relacionado à Eleição</label>
                    <select name="relacionado_eleicao" value={formData.relacionado_eleicao.toString()} onChange={(e) => setFormData(prev => ({ ...prev, relacionado_eleicao: e.target.value === 'true' }))} className="w-full bg-[#f3f3f5] border-none rounded-lg px-3 py-2 text-sm" required>
                      <option value="false">Não</option>
                      <option value="true">Sim</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#0a1c3e] uppercase">Município</label>
                    <SelectAutocomplete name="id_municipio_fk" value={formData.id_municipio_fk} onChange={(value) => handleSelectChange('id_municipio_fk', value)} options={municipios.map((m) => ({ value: m.id_municipio || '', label: m.nome_municipio }))} placeholder="Selecione..." required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#0a1c3e] uppercase">Bairro</label>
                    <SelectAutocomplete name="id_bairro_fk" value={formData.id_bairro_fk} onChange={(value) => handleSelectChange('id_bairro_fk', value)} options={bairrosFiltrados.map((b) => ({ value: b.id_bairro || '', label: b.nome_bairro }))} placeholder="Selecione..." disabled={!formData.id_municipio_fk} required />
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
                      <div className="text-xs text-gray-500 mt-1">Equipe A · Comandante João Silva</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-gray-700">Viatura AR-02</div>
                      <div className="text-xs text-gray-500 mt-1">Equipe B · Comandante Maria Santos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-[#4169E1] hover:bg-[#3557c7] text-white rounded-lg disabled:opacity-50">{loading ? 'Salvando...' : 'Salvar Alterações'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
