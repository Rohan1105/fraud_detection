import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('api/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get(':id/transactions')
  async getTransactions(
    @Param('id') id: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page = '1',
    @Query('size') size = '50',
  ) {
    const customerId = parseInt(id, 10);
    if (isNaN(customerId)) {
      throw new BadRequestException('Invalid customer ID');
    }

    const pageNum = parseInt(page, 10) || 1;
    const sizeNum = parseInt(size, 10) || 50;

    return this.customerService.getTransactions(customerId, from, to, pageNum, sizeNum);
  }
}
