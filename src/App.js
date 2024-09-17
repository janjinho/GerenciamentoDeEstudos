import React, { useState } from 'react';
import './App.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const [showModal, setShowModal] = useState(false);

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

  // Função para calcular progresso
  const calcularProgresso = () => {
    let totalAtividades = 0;
    let atividadesConcluidas = 0;

    Object.keys(estudos).forEach(dia => {
      Object.values(estudos[dia]).forEach(atividade => {
        totalAtividades++;
        if (atividade !== '') {
          atividadesConcluidas++;
        }
      });
    });

    return (atividadesConcluidas / totalAtividades) * 100;
  };

  // Dados para o gráfico
  const chartData = {
    labels: diasDaSemana,
    datasets: [
      {
        label: 'Progresso dos Estudos',
        data: diasDaSemana.map(dia => {
          const atividadesDia = Object.values(estudos[dia]);
          const concluidas = atividadesDia.filter(atividade => atividade !== '').length;
          return (concluidas / 3) * 100; // Cada dia tem 3 períodos
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

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
          onKeyPress={handleKeyPress}
          placeholder="Ex: Matemática"
        />
        <button onClick={adicionarAtividade}>Adicionar Estudo</button>
      </div>

      {/* Grid de dias da semana */}
      <div className="dias-semana-grid">
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
      </div>

      {/* Botão para exibir o progresso */}
      <button className="button-progresso" onClick={() => setShowModal(true)}>
        Ver Progresso
      </button>

      {/* Modal de Progresso */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Progresso Total: {calcularProgresso().toFixed(2)}%</h2>
            <Bar data={chartData} options={chartOptions} />
            <button className="button-close" onClick={() => setShowModal(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
