import React, { useState, useEffect, useRef } from 'react';
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

  // Estados para o cronômetro
  const [segundos, setSegundos] = useState(0);
  const [ativo, setAtivo] = useState(false);
  const timerRef = useRef(null);

  // Estado para o tema
  const [temaEscuro, setTemaEscuro] = useState(false);

  // Estado para controlar a visibilidade do pop-up de lembretes
  const [mostrarLembrete, setMostrarLembrete] = useState(false);
  const [lembreteTexto, setLembreteTexto] = useState('');

  // Função para adicionar atividade
  const adicionarAtividade = () => {
    if (!atividade) return;

    setEstudos((prevEstudos) => ({
      ...prevEstudos,
      [diaSelecionado]: {
        ...prevEstudos[diaSelecionado],
        [periodoSelecionado]: atividade,
      },
    }));

    setAtividade('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      adicionarAtividade();
    }
  };

  const removerAtividade = (dia, periodo) => {
    setEstudos((prevEstudos) => ({
      ...prevEstudos,
      [dia]: {
        ...prevEstudos[dia],
        [periodo]: '',
      },
    }));
  };

  // Funções do cronômetro
  useEffect(() => {
    if (ativo) {
      timerRef.current = setInterval(() => {
        setSegundos((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [ativo]);

  const startCronometro = () => setAtivo(true);
  const pauseCronometro = () => setAtivo(false);
  const resetCronometro = () => {
    setAtivo(false);
    setSegundos(0);
  };

  // Função para alternar o tema
  const alternarTema = () => {
    setTemaEscuro(!temaEscuro);
  };

  // Formatar os segundos no formato HH:MM:SS
  const formatarTempo = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
  };

  // Funções para lidar com o pop-up de lembretes
  const abrirLembrete = () => setMostrarLembrete(true);
  const fecharLembrete = () => setMostrarLembrete(false);

  return (
    <div className={`app-container ${temaEscuro ? 'tema-escuro' : 'tema-claro'}`}>
      {/* Botão de tema */}
      <button className='tema' onClick={alternarTema}>
        {temaEscuro ? '🌞' : '🌙'}
      </button>

      {/* Título */}
      <h1>Gerenciador de Estudos</h1>

      {/* Inputs para adicionar atividades */}
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
          onKeyPress={handleKeyPress}
          placeholder="Ex: Matemática"
        />
        <button onClick={adicionarAtividade}>Adicionar Estudo</button>
      </div>

      {/* Dias da semana e atividades */}
      {diasDaSemana.map((dia, index) => (
        <div
          key={dia}
          className={`dia-container ${dia === 'Domingo' ? 'domingo' : dia === 'Quarta-feira' ? 'quartafeira' : dia === 'Quinta-feira' ? 'quintafeira' : ''}`}
          style={{ gridColumn: `${(index % 4) + 1}`, gridRow: `${Math.floor(index / 4) + 2}` }}
        >
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
      {/* Seção do cronômetro */}
      <div className="cronometro-container">
        <h2>Cronômetro</h2>
        <div className="cronometro-display">
          <span>{formatarTempo(segundos)}</span>
        </div>
        <div className="cronometro-controles">
          <button onClick={startCronometro}>Play</button>
          <button onClick={pauseCronometro}>Pausa</button>
          <button onClick={resetCronometro}>Reset</button>
        </div>
      </div>

      {/* Botão de lembretes */}
      <button className='lembretes' onClick={abrirLembrete}>📒</button>

      {/* Pop-up de lembretes */}
      {mostrarLembrete && (
        <div className="popup-lembrete">
          <div className="popup-content">
            <h2>Anotações</h2>
            <textarea
              value={lembreteTexto}
              onChange={(e) => setLembreteTexto(e.target.value)}
              placeholder="Escreva suas anotações aqui..."
            />
            <div className="popup-actions">
              <button onClick={fecharLembrete}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
