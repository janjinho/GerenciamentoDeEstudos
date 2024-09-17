import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
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

  const [metas, setMetas] = useState({
    semanal: 10,  // Defina aqui a meta semanal de horas
    mensal: 40,   // Defina aqui a meta mensal de horas
  });

  const [atividade, setAtividade] = useState('');
  const [diaSelecionado, setDiaSelecionado] = useState('Segunda-feira');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('manha');

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

  const calcularHorasEstudadasSemana = (estudos) => {
    let totalHoras = 0;
    Object.values(estudos).forEach((dia) => {
      totalHoras += dia.manha ? 1 : 0;
      totalHoras += dia.tarde ? 1 : 0;
      totalHoras += dia.noite ? 1 : 0;
    });
    return totalHoras;
  };

  const calcularHorasEstudadasMes = (estudos) => {
    return calcularHorasEstudadasSemana(estudos) * 4;
  };

  useEffect(() => {
    const ctx = document.getElementById('graficoProgresso').getContext('2d');

    const horasEstudadasSemana = calcularHorasEstudadasSemana(estudos);
    const horasEstudadasMes = calcularHorasEstudadasMes(estudos);

    if (window.myChart) {
      window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Meta Semanal', 'Meta Mensal'],
        datasets: [{
          label: 'Progresso (%)',
          data: [
            (horasEstudadasSemana / metas.semanal) * 100 || 0,
            (horasEstudadasMes / metas.mensal) * 100 || 0
          ],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          }
        }
      }
    });
  }, [metas, estudos]);

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

      {/* Seção de Metas e Gráfico */}
      <div className="metas-container">
        <h2>Metas de Estudo</h2>
        <p>Meta Semanal: {metas.semanal} horas</p>
        <p>Meta Mensal: {metas.mensal} horas</p>
        <canvas id="graficoProgresso" width="400" height="200"></canvas>
      </div>
    </div>
  );
}

export default App;