import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';
import sortUp from '../../assets/Sort_Up.svg';
import sortDown from '../../assets/Sort_Down.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue, { formatDate } from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

type Transaction = {
  [key in string | number]: any;
} & {
  id: string;
  title: string;
  value: string;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string; };
  created_at: Date;
};

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface ServerData {
  transactions: Transaction[];
  balance: Balance;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [elementoFiltrado, setElementoFiltrado] = useState<string>();

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      await api.get<ServerData>('/transactions').then(response => {
        setTransactions(response.data.transactions);
        setBalance(response.data.balance);
      });
    }

    loadTransactions();
  }, []);

  const filterList = (coluna: string) => {
    setElementoFiltrado(coluna);
    const transactionsFiltered = transactions.sort((a: Transaction, b: Transaction) => {
      let v, m;
      switch (coluna) {
        case 'titulo':
          v = a.title;
          m = b.title;
          break;
        case 'preco':
          if(a.type === "income"){
            v = parseFloat(a.value);
          }else{
            v = -parseFloat(a.value);
          }

          if(b.type === "income"){
            m = parseFloat(b.value)
          }else{
            m = -parseFloat(b.value)
          }

          break;
        case 'categoria':
          v = a.category.title;
          m = b.category.title;
          break;
        case 'data':
          v = a.created_at;
          m = b.created_at;
          break;
        default:
          v = '';
          m = '';
      }

        if (v > m) {
          return 1;
        }
        if (v < m) {
          return -1;
        }
        return 0;
      },
    );
    setTransactions([...transactionsFiltered]);
  };

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              {balance.income
                ? formatValue(parseFloat(balance.income))
                : 'R$ 0,00'}
            </h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {balance.outcome
                ? formatValue(parseFloat(balance.outcome))
                : 'R$ 0,00'}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              {balance.total
                ? formatValue(parseFloat(balance.total))
                : 'R$ 0,00'}
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>
                  Título
                  <span
                    onClick={e => filterList('titulo')}
                    className="sort-icon"
                  >
                    <img src={elementoFiltrado === 'titulo' ? sortUp : sortDown} />
                  </span>
                </th>
                <th>
                  Preço
                  <span
                    onClick={e => filterList('preco')}
                    className="sort-icon"
                  >
                    <img src={elementoFiltrado === 'preco' ? sortUp : sortDown} />
                  </span>
                </th>
                <th>
                  Categoria
                  <span
                    onClick={e => filterList('categoria')}
                    className="sort-icon"
                  >
                    <img src={elementoFiltrado === 'categoria' ? sortUp : sortDown} />
                  </span>
                </th>
                <th>
                  Data
                  <span onClick={e => filterList('data')} className="sort-icon">
                    <img src={elementoFiltrado === 'data' ? sortUp : sortDown} />
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => {
                return (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td
                      className={
                        transaction.type === 'income' ? 'income' : 'outcome'
                      }
                    >
                      {transaction.type === 'income' ? '' : '- '}{' '}
                      {formatValue(parseFloat(transaction.value))}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{new Intl.DateTimeFormat('pt-BR').format(new Date(transaction.created_at))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
