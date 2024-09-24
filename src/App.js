import React, { useState, useEffect } from 'react';
import './App.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const diasDaSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

  const [estudos, setEstudos] = useState({
    'Segunda-feira': { manha: '', tarde: '', noite: '', concluido: { manha: false, tarde: false, noite: false } },
    'Terça-feira': { manha: '', tarde: '', noite: '', concluido: { manha: false, tarde: false, noite: false } },
    'Quarta-feira': { manha: '', tarde: '', noite: '', concluido: { manha: false, tarde: false, noite: false } },
    'Quinta-feira': { manha: '', tarde: '', noite: '', concluido: { manha: false, tarde: false, noite: false } },
    'Sexta-feira': { manha: '', tarde: '', noite: '', concluido: { manha: false, tarde: false, noite: false } },
    'Sábado': { manha: '', tarde: '', noite: '', concluido: { manha: false, tarde: false, noite: false } },
    'Domingo': { manha: '', tarde: '', noite: '', concluido: { manha: false, tarde: false, noite: false } },
  });

  const [atividade, setAtividade] = useState('');
  const [diaSelecionado, setDiaSelecionado] = useState('Segunda-feira');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('manha');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const estudosSalvos = localStorage.getItem('estudos');
    if (estudosSalvos) {
      setEstudos(JSON.parse(estudosSalvos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('estudos', JSON.stringify(estudos));
  }, [estudos]);

  const adicionarAtividade = () => {
    if (!atividade) return;

    setEstudos((prevEstudos) => ({
      ...prevEstudos,
      [diaSelecionado]: {
        ...prevEstudos[diaSelecionado],
        [periodoSelecionado]: atividade,
        concluido: {
          ...prevEstudos[diaSelecionado].concluido,
          [periodoSelecionado]: false
        }
      },
    }));

    setAtividade('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      adicionarAtividade();
    }
  };

  const marcarComoConcluido = (dia, periodo) => {
    setEstudos((prevEstudos) => ({
      ...prevEstudos,
      [dia]: {
        ...prevEstudos[dia],
        concluido: {
          ...prevEstudos[dia].concluido,
          [periodo]: !prevEstudos[dia].concluido[periodo],
        },
      },
    }));
  };

  const handleRemover = (dia, periodo) => {
    setEstudos((prevEstudos) => ({
      ...prevEstudos,
      [dia]: {
        ...prevEstudos[dia],
        [periodo]: '',
        concluido: {
          ...prevEstudos[dia].concluido,
          [periodo]: false,
        },
      },
    }));
  };

  const calcularProgresso = () => {
    let totalAtividades = 0;
    let atividadesConcluidas = 0;

    Object.keys(estudos).forEach(dia => {
      Object.values(estudos[dia].concluido).forEach(concluido => {
        totalAtividades++;
        if (concluido) {
          atividadesConcluidas++;
        }
      });
    });

    return (atividadesConcluidas / totalAtividades) * 100;
  };

  const chartData = {
    labels: diasDaSemana,
    datasets: [
      {
        label: 'Progresso dos Estudos',
        data: diasDaSemana.map(dia => {
          const atividadesConcluidas = Object.values(estudos[dia].concluido).filter(concluido => concluido).length;
          return (atividadesConcluidas / 3) * 100;
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

      <div className="dias-semana-grid">
        {diasDaSemana.map(dia => (
          <div key={dia} className="dia-container">
            <h2>{dia}</h2>
            {['manha', 'tarde', 'noite'].map(periodo => (
              <div key={periodo} className="periodo-container">
                <strong>{periodo.charAt(0).toUpperCase() + periodo.slice(1)}:</strong>
                <div>{estudos[dia][periodo]}</div>
                {estudos[dia][periodo] && (
                  <button
                    className={estudos[dia].concluido[periodo] ? 'button-remover' : 'button-concluir'}
                    onClick={() => {
                      if (estudos[dia].concluido[periodo]) {
                        handleRemover(dia, periodo);
                      } else {
                        marcarComoConcluido(dia, periodo);
                      }
                    }}
                  >
                    {estudos[dia].concluido[periodo] ? 'Remover' : 'Concluir'}
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button className="button-progresso" onClick={() => setShowModal(true)}>
        Ver Progresso
      </button>

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
