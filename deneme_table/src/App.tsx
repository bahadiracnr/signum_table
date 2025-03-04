import { ApolloProvider } from '@apollo/client';
import client from './client';
import BasicFilterDemo from './demodata/BasicFilterDemo';
import ColorChart from './piechart/ColorChart';
import { useColorTasks } from './piechart/useColor';
import { useLineChart } from './linechart/useLineChart';
import LineChartDemo from './linechart/LineChartDemo';
import BarChart from './barChart/BarChart';
import { useBarChart } from './barChart/useBarChart';
import './index.css';
import { Card } from 'primereact/card';
import Navbar from './navbar/navbar';
import Menubar from './menubar/menubar';

function AppContent() {
  const { tasks, loading } = useColorTasks();
  const { tasks1, loading1, error1 } = useLineChart();
  const { tasks2, loading2, error2 } = useBarChart();

  return (
    <>
      <div className="nav">
        <Navbar></Navbar>
      </div>
      <div className="parent">
        <div className="div2">
          <Card className="full">
            <Menubar></Menubar>
          </Card>
        </div>
        <div className="div3">
          <div className="card1 ">
            {' '}
            <BasicFilterDemo />
          </div>
        </div>
        <div className="div4">
          <div className="div2">
            <div className="card2">
              <LineChartDemo tasks={tasks1} loading={loading1} error={error1} />
            </div>
          </div>
        </div>
        <div className="div5">
          <div className="div3">
            <div className="card3">
              <BarChart tasks={tasks2} loading={loading2} error={error2} />
            </div>
          </div>
        </div>
        <div className="div6">
          <div className="div4">
            <div className="card4">
              <ColorChart tasks={tasks} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <AppContent />
    </ApolloProvider>
  );
}

export default App;
