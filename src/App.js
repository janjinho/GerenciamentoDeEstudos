import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const diasDaSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  const periodos = ['manha', 'tarde', 'noite'];

  const [estudos, setEstudos] = useState({
    'Segunda-feira': { manha: '', tarde: '', noite: '' },
    'Terça-feira': { manha: '', tarde: '', noite: '' },
    'Quarta-feira': { manha: '', tarde: '', noite: '' },
    'Quinta-feira': { manha: '', tarde: '', noite: '' },
    'Sexta-feira': { manha: '', tarde: '', noite: '' },
    'Sábado': { manha: '', tarde: '', noite: '' },
    'Domingo': { manha: '', tarde: '', noite: '' },
  });

  const [atividade, setAtividade] = useState('');
  const [diaSelecionado, setDiaSelecionado] = useState('Segunda-feira');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('manha');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [atividadeEditada, setAtividadeEditada] = useState({ dia: '', periodo: '' });
  const [filtroPeriodo, setFiltroPeriodo] = useState('');

  // Adicionar ou Editar atividade
  const adicionarOuEditarAtividade = () => {
    if (!atividade) return;

    setEstudos((prevEstudos) => ({
      ...prevEstudos,
      [modoEdicao ? atividadeEditada.dia : diaSelecionado]: {
        ...prevEstudos[modoEdicao ? atividadeEditada.dia : diaSelecionado],
        [modoEdicao ? atividadeEditada.periodo : periodoSelecionado]: atividade,
      },
    }));

    setAtividade(''); // Limpar os campos após adicionar/editar
    setModoEdicao(false);
  };

  // Captura a tecla Enter para adicionar/editar atividade
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      adicionarOuEditarAtividade();
    }
  };

  // Remover atividade específica
  const removerAtividade = (dia, periodo) => {
    setEstudos((prevEstudos) => ({
      ...prevEstudos,
      [dia]: {
        ...prevEstudos[dia],
        [periodo]: '',
      },
    }));
  };

  // Editar uma atividade existente
  const editarAtividade = (dia, periodo) => {
    setAtividadeEditada({ dia, periodo });
    setAtividade(estudos[dia][periodo]);
    setModoEdicao(true);
    setDiaSelecionado(dia);
    setPeriodoSelecionado(periodo);
  };

  // Função para resetar todas as atividades da semana
  const resetarEstudos = () => {
    setEstudos({
      'Segunda-feira': { manha: '', tarde: '', noite: '' },
      'Terça-feira': { manha: '', tarde: '', noite: '' },
      'Quarta-feira': { manha: '', tarde: '', noite: '' },
      'Quinta-feira': { manha: '', tarde: '', noite: '' },
      'Sexta-feira': { manha: '', tarde: '', noite: '' },
      'Sábado': { manha: '', tarde: '', noite: '' },
      'Domingo': { manha: '', tarde: '', noite: '' },
    });
  };

  // Função para filtrar atividades por período
  const filtrarPorPeriodo = (periodo) => {
    setFiltroPeriodo(periodo);
  };

  // Salva e restaura os dados do local storage
  useEffect(() => {
    const estudosSalvos = localStorage.getItem('estudos');
    if (estudosSalvos) {
      setEstudos(JSON.parse(estudosSalvos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('estudos', JSON.stringify(estudos));
  }, [estudos]);

  return (
    <div className="app-container">
      <h1>Gerenciador de Estudos</h1>

      <div className="input-container">
        <label>Dia:</label>
        <select value={diaSelecionado} onChange={(e) => setDiaSelecionado(e.target.value)}>
          {diasDaSemana.map(dia => (
            <option key={dia} value={dia}>{dia}</option>
          ))}
        </select>

        <label>Período:</label>
        <select value={periodoSelecionado} onChange={(e) => setPeriodoSelecionado(e.target.value)}>
          {periodos.map(periodo => (
            <option key={periodo} value={periodo}>{periodo.charAt(0).toUpperCase() + periodo.slice(1)}</option>
          ))}
        </select>

        <label>O que estudar:</label>
        <input
          type="text"
          value={atividade}
          onChange={(e) => setAtividade(e.target.value)}
          onKeyPress={handleKeyPress} // Captura a tecla Enter para adicionar/editar
          placeholder="Ex: Matemática"
        />
        <button onClick={adicionarOuEditarAtividade}>
          {modoEdicao ? 'Salvar Alteração' : 'Adicionar Estudo'}
        </button>
      </div>

      {/* Filtro por período */}
      <div className="filtro-container">
        <label>Filtrar por Período:</label>
        <select onChange={(e) => filtrarPorPeriodo(e.target.value)}>
          <option value="">Todos</option>
          {periodos.map(periodo => (
            <option key={periodo} value={periodo}>{periodo.charAt(0).toUpperCase() + periodo.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Exibir os dias da semana e suas atividades */}
      {diasDaSemana.map(dia => (
        <div key={dia} className="dia-container">
          <h2>{dia}</h2>
          {periodos.map(periodo => (
            filtroPeriodo === '' || filtroPeriodo === periodo ? (
              <div key={periodo} className="periodo-container">
                <strong>{periodo.charAt(0).toUpperCase() + periodo.slice(1)}:</strong>
                <div>{estudos[dia][periodo]}</div>
                {estudos[dia][periodo] && (
                  <>
                    <button className="button-editar" onClick={() => editarAtividade(dia, periodo)}>✎</button>
                    <button className="button-remover" onClick={() => removerAtividade(dia, periodo)}>x</button>
                  </>
                )}
              </div>
            ) : null
          ))}
        </div>
      ))}

      {/* Botão para resetar todas as atividades */}
      <button onClick={resetarEstudos} className="button-reset">Resetar Semana</button>
    </div>
  );
}

export default App;