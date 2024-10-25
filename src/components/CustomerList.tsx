import React from 'react';
import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Button } from '@tremor/react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import type { Customer } from '@/types';

interface CustomerListProps {
  customers: Customer[];
  onViewConversation: (customerId: string) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({ customers, onViewConversation }) => {
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>お客様No.</TableHeaderCell>
            <TableHeaderCell>クライアントID</TableHeaderCell>
            <TableHeaderCell>写真</TableHeaderCell>
            <TableHeaderCell>初回接触日</TableHeaderCell>
            <TableHeaderCell>最終接触日</TableHeaderCell>
            <TableHeaderCell>会話数</TableHeaderCell>
            <TableHeaderCell>操作</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.id}</TableCell>
              <TableCell>{customer.clientId}</TableCell>
              <TableCell>
                {customer.photo && (
                  <img
                    src={customer.photo}
                    alt="Customer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
              </TableCell>
              <TableCell>
                {new Date(customer.firstContact).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(customer.lastContact).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge color="blue">
                  {customer.totalConversations}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  size="xs"
                  variant="secondary"
                  icon={ChatBubbleLeftRightIcon}
                  onClick={() => onViewConversation(customer.id)}
                >
                  会話ログ
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};