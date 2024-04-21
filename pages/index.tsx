import { WithDefaultLayout } from '../components/DefautLayout';
// import { Title } from '../components/Title';
import { Page } from '../types/Page';
// import QueueManager from './QueueManager';
import { Input, Button, Row, Col, Space, message } from 'antd';
import { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';


type QueuesType = {
    [key: string]: string[];
};

const initialQueues: QueuesType  = {
  cashier1: [],
  cashier2: [],
  cashier3: []
};

const IndexPage: Page = () => {
    const [queues, setQueues] = useState<QueuesType>(initialQueues);
    const [name, setName] = useState('');

    const handleAddToQueue = (): void => {
        if (!name) {
            message.error('Name is required!');
            return;
        }
        if (Object.values(queues).flat().includes(name)) {
            message.error('Name already in queue!');
            return;
        }
    
        const cashierKeys = Object.keys(queues);
        const randomQueueKey = cashierKeys[Math.floor(Math.random() * cashierKeys.length)] as keyof QueuesType;
        const updatedQueue: QueuesType = {...queues};
        updatedQueue?.[randomQueueKey]?.push(name);
    
        setQueues(updatedQueue);
        setName('');
    };

    const handleServeCustomer = (cashierKey) => {
        const updatedQueue = { ...queues };
        updatedQueue?.[cashierKey]?.shift(); 
        setQueues(updatedQueue);
    };

    const handleClearRow = (rowIndex: number) => {
        let isCleared = false; // Flag to check if any row was cleared
        const updatedQueue: QueuesType = { ...queues };

        (Object.keys(updatedQueue) as Array<keyof QueuesType>).forEach((cashierKey) => {
            if(updatedQueue[cashierKey]){
                if (updatedQueue[cashierKey].length > rowIndex) {
                    updatedQueue[cashierKey].splice(rowIndex, 1);
                    isCleared = true;
                }
            }
        });

        if (!isCleared) {
            // If no row was cleared, show a message
            message.info(`No customer to clear in row ${rowIndex + 1}`);
        } else {
            setQueues(updatedQueue); // Update the state only if a row was cleared
        }
    };

    return (
        <>
            <Space direction="vertical" size="large" style={{ width: '100%', background: '#f0f2f5'}}>
                <Row gutter={[16, 16]}>
                    {/* clear row button */}
                    <Col>
                    <Space direction="vertical">
                        {[1, 2, 3].map((rowNumber) => (
                            <Button key={rowNumber} onClick={() => handleClearRow(rowNumber - 1)} style={{ marginBottom: '10px' }}>
                                Clear Row {rowNumber}
                            </Button>
                        ))}
                    </Space>
                </Col>

                    {/* cashier columns */}
                    {Object.keys(queues).map((cashierKey, index) => (
                        <Col key={cashierKey} span={7} style={{ textAlign: 'center' }}>
                            <div style={{ border: '1px solid #d9d9d9', padding: '20px', borderRadius: '8px', background: 'white' }}>
                                <Row>
                                    <div style={{
                                        border: '1px solid #d9d9d9',
                                        borderRadius: '4px',
                                        padding: '8px 16px', 
                                        margin: 'auto',
                                        textAlign: 'center',
                                        display: 'flex', 
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '40px',
                                        width: '100%',
                                        background: '#e6f7ff',
                                        }}>
                                        Cashier #{index + 1}
                                    </div>
                                </Row>
                                <Row justify='center'>
                                    {/* customer*/}
                                    <Space direction="vertical">
                                        {queues?.[cashierKey]?.slice(0, 3).map((customer, i) => (
                                            <div key={i} style={{
                                                margin: '8px',
                                                border: '1px solid black',
                                                borderRadius: '50%',
                                                padding: '10px',
                                                width: '50px',
                                                height: '50px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                background: '#FFDAB9'
                                              }}>
                                                {customer}
                                            </div>
                                        ))}
                                        {queues[cashierKey] && queues[cashierKey].length > 3 && (
                                            <div style={{ border: '1px solid black', borderRadius: '50%' }}>
                                                +{queues[cashierKey].length - 3} more
                                            </div>
                                        )}
                                    </Space>
                                </Row>
                                
                            </div>
                        </Col>
                    ))}
                </Row>

                {/* input panel */}
                <Row gutter={[16, 16]}>
                    {/* input customer */}
                    <Col span={12}>
                        <Input
                            placeholder="Enter customer name"
                            prefix={<UserOutlined />}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Button type="primary" onClick={handleAddToQueue} block style={{ background: '#52c41a', color: 'white', marginTop: '10px'}}>
                            Enter Line
                        </Button>
                    </Col>
                    {/* handle cashier button */}
                    <Col span={12}>
                        {Object.keys(queues).map((cashierKey) => (
                            <Button key={cashierKey} onClick={() => handleServeCustomer(cashierKey)} block style={{ background: '#52c41a', color: 'white', marginBottom: '10px' }}>
                                Handle {cashierKey}
                            </Button>
                        ))}
                    </Col>
                </Row>
            </Space>
        </>
    );
};

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
