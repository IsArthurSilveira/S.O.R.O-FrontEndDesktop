import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { getClient } from '../services/apiService';
import SelectAutocomplete from '../components/SelectAutocomplete/SelectAutocomplete';
import MapView from '../components/MapView/MapView';
import type { 
  Natureza, 
  Grupo, 
  Subgrupo, 
  Municipio, 
  Bairro, 
  FormaAcervo 
} from '../services/api';

interface FormData {
  id_natureza_fk: string;
  id_grupo_fk: string;
  id_subgrupo_fk: string;
  id_forma_acervo_fk: string;
  data_acionamento: string;
  hora_acionamento: string;
  nr_aviso: string;
  id_municipio_fk: string;
  id_bairro_fk: string;
  logradouro: string;
  ponto_referencia: string;
}

export default function NovaOcorrencia() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [nextOcorrenciaId, setNextOcorrenciaId] = useState<string>('');

  // Estados para listas de seleção
  const [naturezas, setNaturezas] = useState<Natureza[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [subgrupos, setSubgrupos] = useState<Subgrupo[]>([]);
  const [formasAcervo, setFormasAcervo] = useState<FormaAcervo[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [bairros, setBairros] = useState<Bairro[]>([]);

  // Estados para filtros em cascata
  const [gruposFiltrados, setGruposFiltrados] = useState<Grupo[]>([]);
  const [subgruposFiltrados, setSubgruposFiltrados] = useState<Subgrupo[]>([]);
  const [bairrosFiltrados, setBairrosFiltrados] = useState<Bairro[]>([]);

  // Estado do formulário
  const [formData, setFormData] = useState<FormData>({
    id_natureza_fk: '',
    id_grupo_fk: '',
    id_subgrupo_fk: '',
    id_forma_acervo_fk: '',
    data_acionamento: new Date().toISOString().split('T')[0],
    hora_acionamento: new Date().toTimeString().slice(0, 5),
    nr_aviso: '',
    id_municipio_fk: '',
    id_bairro_fk: '',
    logradouro: '',
    ponto_referencia: '',
  });

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const client = getClient();
      
      const [
        naturezasData,
        gruposData,
        subgruposData,
        formasAcervoData,
        municipiosData,
        bairrosData,
        ocorrenciasData
      ] = await Promise.all([
        client.adminNaturezas.getApiv3Naturezas(),
        client.adminGrupos.getApiv3Grupos(),
        client.adminSubgrupos.getApiv3Subgrupos(),
        client.adminFormasDeAcervo.getApiv3FormasAcervo(),
        client.adminMunicPios.getApiv3Municipios(),
        client.adminBairros.getApiv3Bairros(),
        client.ocorrNcias.getApiv3Ocorrencias(undefined, undefined, undefined, 1, 1)
      ]);

      // Dados carregados
      setNaturezas(naturezasData || []);
      setGrupos(gruposData || []);
      setSubgrupos(subgruposData || []);
      setFormasAcervo(formasAcervoData || []);
      setMunicipios(municipiosData || []);
      setBairros(bairrosData || []);

      // Calcula próximo ID (simulação)
      const totalOcorrencias = ocorrenciasData?.total || 0;
      setNextOcorrenciaId(`#${String(totalOcorrencias + 1).padStart(6, '0')}`);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar grupos quando natureza é selecionada
  useEffect(() => {
    if (formData.id_natureza_fk) {
      const filtered = grupos.filter(
        (g) => g.id_natureza_fk === formData.id_natureza_fk
      );
      setGruposFiltrados(filtered);
      setFormData((prev) => ({
        ...prev,
        id_grupo_fk: '',
        id_subgrupo_fk: '',
      }));
    } else {
      setGruposFiltrados([]);
    }
  }, [formData.id_natureza_fk, grupos]);

  // Filtrar subgrupos quando grupo é selecionado
  useEffect(() => {
    if (formData.id_grupo_fk) {
      const filtered = subgrupos.filter(
        (s) => s.id_grupo_fk === formData.id_grupo_fk
      );
      setSubgruposFiltrados(filtered);
      
      setFormData((prev) => ({
        ...prev,
        id_subgrupo_fk: '',
      }));
    } else {
      setSubgruposFiltrados([]);
    }
  }, [formData.id_grupo_fk, subgrupos]);

  // Filtrar bairros quando município é selecionado
  useEffect(() => {
    if (formData.id_municipio_fk) {
      const filtered = bairros.filter(
        (b) => b.id_municipio_fk === formData.id_municipio_fk
      );
      setBairrosFiltrados(filtered);
      
      setFormData((prev) => ({
        ...prev,
        id_bairro_fk: '',
      }));
    } else {
      setBairrosFiltrados([]);
    }
  }, [formData.id_municipio_fk, bairros]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      
      // Criar um objeto Date com a data e hora locais digitadas
      const [ano, mes, dia] = formData.data_acionamento.split('-');
      const [hora, minuto] = formData.hora_acionamento.split(':');
      
      // Criar Date sem conversão (hora local do Brasil)
      const dataLocal = new Date(
        parseInt(ano), 
        parseInt(mes) - 1, 
        parseInt(dia), 
        parseInt(hora), 
        parseInt(minuto)
      );
      
      // Converter para ISO string UTC (adiciona +3h automaticamente)
      const dataHoraAcionamento = dataLocal.toISOString();
      
      const ocorrenciaInput = {
        data_acionamento: dataHoraAcionamento,
        hora_acionamento: dataHoraAcionamento,
        id_subgrupo_fk: formData.id_subgrupo_fk,
        id_bairro_fk: formData.id_bairro_fk,
        id_forma_acervo_fk: formData.id_forma_acervo_fk,
        nr_aviso: formData.nr_aviso || undefined,
        logradouro: formData.logradouro || undefined,
        ponto_referencia: formData.ponto_referencia || undefined,
      };

      console.log('Enviando ocorrência:', ocorrenciaInput);
          // Enviando ocorrência
      await client.ocorrNcias.postApiv3Ocorrencias(ocorrenciaInput);
      
      alert('Ocorrência registrada com sucesso!');
      navigate('/ocorrencias');
    } catch (error: any) {
          // Erro ao salvar ocorrência
          // Mostra erros de validação específicos
      
      // Mostrar erros de validação específicos
      if (error?.body && Array.isArray(error.body)) {
        const erros = error.body.map((e: any) => `${e.field}: ${e.message}`).join('\n');
        alert(`Erro de validação:\n${erros}`);
      } else {
        alert(`Erro ao registrar ocorrência: ${error?.body?.message || error?.message || 'Tente novamente.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/ocorrencias');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg sm:rounded-[14px] shadow-lg w-full h-full overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-100 min-h-[60px] sm:h-[70px] px-3 sm:px-5 py-3 sm:py-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-sm sm:text-[15px] font-medium text-[#0a1c3e]">
            Registro de Nova Ocorrência
          </h1>
          {nextOcorrenciaId && (
            <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">
              Próximo ID: {nextOcorrenciaId}
            </span>
          )}
          {loading && (
            <span className="text-[10px] sm:text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md animate-pulse whitespace-nowrap">
              Carregando dados...
            </span>
          )}
        </div>

        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 sm:flex-none bg-[#c6f4ce] hover:bg-[#b0e8b8] text-black font-medium text-xs sm:text-[13px] px-4 sm:px-6 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Ocorrência'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 sm:flex-none bg-white hover:bg-gray-50 border border-gray-100 text-[#0a1c3e] font-medium text-xs sm:text-[13px] px-4 sm:px-6 py-1.5 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-3 sm:p-5">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* LINHA 1: Classificação + Data/Hora */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Coluna 1 e 2: Classificação (2 colunas lado a lado) */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Lado Esquerdo */}
              <div className="space-y-3">
                <div className="border-b border-gray-100 pb-1">
                  <h2 className="text-[13px] font-medium text-[#0a1c3e]">Classificação</h2>
                </div>

                {/* Natureza */}
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#0a1c3e]">Natureza</label>
                  <SelectAutocomplete
                    name="id_natureza_fk"
                    value={formData.id_natureza_fk}
                    onChange={(value) => {
                        // Natureza selecionada
                      handleSelectChange('id_natureza_fk', value);
                    }}
                    options={(() => {
                      const opts = naturezas.map((n) => ({
                        value: n.id_natureza || '',
                        label: n.descricao,
                      }));
                        // Opções de Natureza
                      return opts;
                    })()}
                    placeholder="Selecione..."
                    required
                  />
                </div>

                {/* Grupo */}
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#0a1c3e]">Grupo</label>
                  <SelectAutocomplete
                    name="id_grupo_fk"
                    value={formData.id_grupo_fk}
                    onChange={(value) => handleSelectChange('id_grupo_fk', value)}
                    options={gruposFiltrados.map((g) => ({
                      value: g.id_grupo || '',
                      label: g.descricao_grupo,
                    }))}
                    placeholder="Selecione..."
                    disabled={!formData.id_natureza_fk}
                    required
                  />
                </div>
              </div>

              {/* Lado Direito */}
              <div className="space-y-3">
                <div className="border-b border-gray-100 pb-1">
                  <h2 className="text-[13px] font-medium text-[#0a1c3e] opacity-0">-</h2>
                </div>

                {/* Subgrupo */}
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#0a1c3e]">Subgrupo</label>
                  <SelectAutocomplete
                    name="id_subgrupo_fk"
                    value={formData.id_subgrupo_fk}
                    onChange={(value) => handleSelectChange('id_subgrupo_fk', value)}
                    options={subgruposFiltrados.map((s) => ({
                      value: s.id_subgrupo || '',
                      label: s.descricao_subgrupo,
                    }))}
                    placeholder="Selecione..."
                    disabled={!formData.id_grupo_fk}
                    required
                  />
                </div>

                {/* Forma de Acervo */}
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#0a1c3e]">
                    Forma de Acervo
                  </label>
                  <SelectAutocomplete
                    name="id_forma_acervo_fk"
                    value={formData.id_forma_acervo_fk}
                    onChange={(value) => handleSelectChange('id_forma_acervo_fk', value)}
                    options={formasAcervo.map((f) => ({
                      value: f.id_forma_acervo || '',
                      label: f.descricao,
                    }))}
                    placeholder="Selecione..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Coluna 3: Data, Hora e Número do Aviso */}
            <div className="space-y-3">
              <div className="border-b border-gray-100 pb-1">
                <h2 className="text-[13px] font-medium text-[#0a1c3e]">Data/Hora</h2>
              </div>

              {/* Data do Acionamento */}
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#0a1c3e]">
                  Data
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="data_acionamento"
                    value={formData.data_acionamento}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-100 rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c6f4ce]"
                    required
                  />
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                </div>
              </div>

              {/* Hora do Acionamento */}
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#0a1c3e]">
                  Hora
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="hora_acionamento"
                    value={formData.hora_acionamento}
                    onChange={handleChange}
                    className="w-full bg-[#f3f3f5] border-none rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c6f4ce]"
                    required
                  />
                  <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                </div>
              </div>

              {/* Número do Aviso */}
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#0a1c3e]">
                  Nº Aviso
                </label>
                <input
                  type="text"
                  name="nr_aviso"
                  value={formData.nr_aviso}
                  onChange={handleChange}
                  placeholder="Digite o número..."
                  className="w-full bg-white border border-gray-100 rounded-lg px-3 py-1.5 text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c6f4ce]"
                />
              </div>
            </div>
          </div>

          {/* LINHA 2: Localização */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {/* Coluna Esquerda - Formulário */}
            <div className="space-y-3">
              <div className="border-b border-gray-100 pb-1">
                <h2 className="text-[13px] font-medium text-[#0a1c3e]">Localização</h2>
              </div>

              {/* Município e Bairro */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#0a1c3e]">Município</label>
                  <SelectAutocomplete
                    name="id_municipio_fk"
                    value={formData.id_municipio_fk}
                    onChange={(value) => handleSelectChange('id_municipio_fk', value)}
                    options={municipios.map((m) => ({
                      value: m.id_municipio || '',
                      label: m.nome_municipio,
                    }))}
                    placeholder="Selecione..."
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#0a1c3e]">Bairro</label>
                  <SelectAutocomplete
                    name="id_bairro_fk"
                    value={formData.id_bairro_fk}
                    onChange={(value) => handleSelectChange('id_bairro_fk', value)}
                    options={bairrosFiltrados.map((b) => ({
                      value: b.id_bairro || '',
                      label: b.nome_bairro,
                    }))}
                    placeholder="Selecione..."
                    disabled={!formData.id_municipio_fk}
                    required
                  />
                </div>
              </div>

              {/* Logradouro */}
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#0a1c3e]">Logradouro</label>
                <input
                  type="text"
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleChange}
                  placeholder="Digite o endereço completo..."
                  className="w-full bg-[#f3f3f5] border-none rounded-lg px-3 py-1.5 text-[12px] text-gray-700 placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#c6f4ce]"
                />
              </div>

              {/* Ponto de Referência */}
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#0a1c3e]">
                  Ponto de Referência
                </label>
                <textarea
                  name="ponto_referencia"
                  value={formData.ponto_referencia}
                  onChange={handleChange}
                  placeholder="Descreva pontos de referência próximos..."
                  rows={3}
                  className="w-full bg-[#f3f3f5] border-none rounded-lg px-3 py-1.5 text-[12px] text-gray-700 placeholder:text-[#717182] resize-none focus:outline-none focus:ring-2 focus:ring-[#c6f4ce]"
                />
              </div>
            </div>

            {/* Coluna Direita - Mapa */}
            <div className="flex items-end justify-center">
              <div className="w-full h-[180px] sm:h-[200px]">
                <MapView 
                  municipio={municipios.find(m => m.id_municipio === formData.id_municipio_fk)?.nome_municipio}
                  bairro={bairros.find(b => b.id_bairro === formData.id_bairro_fk)?.nome_bairro}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
