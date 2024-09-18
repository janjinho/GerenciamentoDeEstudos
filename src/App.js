import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const diasDaSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

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

  // Adicionar atividade
  const adicionarAtividade = () => {
    if (!atividade) return;

    setEstudos((prevEstudos) => ({
      ...prevEstudos,
      [diaSelecionado]: {
        ...prevEstudos[diaSelecionado],
        [periodoSelecionado]: atividade,
      },
    }));

    setAtividade(''); // Limpar os campos após adicionar
  };

  // Captura a tecla Enter para adicionar atividade
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      adicionarAtividade();
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
          <option value="manha">Manhã</option>
          <option value="tarde">Tarde</option>
          <option value="noite">Noite</option>
        </select>

        <label>O que estudar:</label>
        <input
          type="text"
          value={atividade}
          onChange={(e) => setAtividade(e.target.value)}
          onKeyPress={handleKeyPress} // Captura a tecla Enter para adicionar
          placeholder="Ex: Matemática"
        />
        <button onClick={adicionarAtividade}>Adicionar Estudo</button>
      </div>

      {/* Exibir os dias da semana e suas atividades */}
      {diasDaSemana.map(dia => (
        <div key={dia} className="dia-container">
          <h2>{dia}</h2>
          <div className="periodo-container">
            <strong>Manhã:</strong>
            <div>{estudos[dia].manha}</div>
            {estudos[dia].manha && (
              <button className="button-remover" onClick={() => removerAtividade(dia, 'manha')}>x</button>
            )}
          </div>
          <div className="periodo-container">
            <strong>Tarde:</strong>
            <div>{estudos[dia].tarde}</div>
            {estudos[dia].tarde && (
              <button className="button-remover" onClick={() => removerAtividade(dia, 'tarde')}>x</button>
            )}
          </div>
          <div className="periodo-container">
            <strong>Noite:</strong>
            <div>{estudos[dia].noite}</div>
            {estudos[dia].noite && (
              <button className="button-remover" onClick={() => removerAtividade(dia, 'noite')}>x</button>
            )}
          </div>
        </div>
      ))}

      {/* Botão para resetar todas as atividades */}
      <button onClick={resetarEstudos} className="button-reset">Resetar Semana</button>
    </div>
  );
}

export default App;