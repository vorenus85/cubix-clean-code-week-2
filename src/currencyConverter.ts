import { InvalidAmountInputError } from "./exceptions/InvalidAmountInputError";
import { InvalidExchangeRateError } from "./exceptions/InvalidExchangeRateError";
import { UnableToFetchExchangeRateError } from "./exceptions/UnableToFetchExchangeRateError";
import { IExchangeRateService } from "./exchangeRateService";

export class CurrencyConverter {

    private readonly FIXED_AMOUNT = 100;

    constructor(private exchangeRateService: IExchangeRateService) { }

    public Convert(amount: number, fromCurrency: string, toCurrency: string): number {
        this.validateAmount(amount);
        const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency);
        this.validateExchangeRate(exchangeRate);
        return amount * exchangeRate;
    }

    public GenerateConversionReport(
        fromCurrency: string,
        toCurrency: string,
        startDate: Date,
        endDate: Date
    ): string {
        const conversions: number[] = [];

        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const exchangeRate = this.exchangeRateService.getExchangeRate(fromCurrency, toCurrency);
            this.validateExchangeRate(exchangeRate);
            this.calculateConversion(exchangeRate, conversions, currentDate);
        }

        return `Conversion Report:\n${conversions.join('\n')}`;
    }

    private getExchangeRate(fromCurrency: string, toCurrency: string) {
        return this.exchangeRateService.getExchangeRate(fromCurrency, toCurrency);
    }

    private calculateConversion(exchangeRate: number, conversions: number[], currentDate: Date) {
        const convertedAmount = this.FIXED_AMOUNT * exchangeRate; // Assume a fixed amount for simplicity
        conversions.push(convertedAmount);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    private validateExchangeRate(exchangeRate: number) {
        if (!exchangeRate) {
            throw new UnableToFetchExchangeRateError('Unable to fetch exchange rate.');
        }

        if (isNaN(exchangeRate)) {
            throw new InvalidExchangeRateError('Invalid exchange rate.');
        }
    }

    private validateAmount(amount: number) {
        if (isNaN(amount)) {
            throw new InvalidAmountInputError('Invalid amount input.');
        }
    }
}