import { InvalidAmountInputError } from "../src/exceptions/InvalidAmountInputError";
import { InvalidExchangeRateError } from "../src/exceptions/InvalidExchangeRateError";
import { UnableToFetchExchangeRateError } from "../src/exceptions/UnableToFetchExchangeRateError";

import { CurrencyConverter } from "../src/currencyConverter"
import { IExchangeRateService } from "../src/exchangeRateService";
import { mock, mockReset } from 'jest-mock-extended';

const mockExchangeRateService = mock<IExchangeRateService>();

describe('CurrencyConverter test::', ()=>{
    let currencyConverter: CurrencyConverter

    beforeEach(()=>{
        mockReset(mockExchangeRateService)
        currencyConverter = new CurrencyConverter(mockExchangeRateService)
    
    });

    describe('Happy scenarios', ()=>{
        it('should convert currency to another currency',()=>{
            // Arrange
            const amount = 1000;
            const fromCurrency = "HUF";
            const toCurrency = "USD";
            const mockedExchangeRate = 2;
            const expected = 2000;
    
            mockExchangeRateService.getExchangeRate.calledWith(fromCurrency,toCurrency).mockReturnValue(mockedExchangeRate);
    
            // Act
            const actualResult = currencyConverter.Convert(amount, fromCurrency, toCurrency)
    
            // Assert
            expect(actualResult).toBe(expected);
        });

        it('should generate conversion report', ()=>{

            // Arrange
            const fromCurrency = "HUF";
            const toCurrency = "USD";
            const startDate = new Date('2023-01-01');
            const endDate = new Date('2023-01-05');
    
            const mockedExchangeRate = 2;
            mockExchangeRateService.getExchangeRate.calledWith(fromCurrency,toCurrency).mockReturnValue(mockedExchangeRate);
    
            // Act
            const actualResult = currencyConverter.GenerateConversionReport(fromCurrency, toCurrency, startDate, endDate)
    
            // Assert
            expect(actualResult).toMatchSnapshot();
    
        });
    });

    describe('Error scenarios', ()=>{
        it('should throw error because of invalid exchangeRate',()=>{
            // Arrange
            const amount = 1000;
            const fromCurrency = "HUF";
            const toCurrency = "USD";
            const mockedExchangeRate = NaN;
            const errorMessage = 'Invalid exchange rate.';
            const expectedError = new InvalidExchangeRateError(errorMessage);
    
            // ensure the mock object’s internal state is verified?? :)
            mockExchangeRateService.getExchangeRate.calledWith(fromCurrency,toCurrency).mockReturnValue(mockedExchangeRate).mockImplementation(() => { throw expectedError });
    
            // Act
    
            // Assert
            expect( ()=> currencyConverter.Convert(amount, fromCurrency, toCurrency)).toThrow(expectedError);
        });
    
        it('should throw error because of invalid amount input',()=>{
            // Arrange
            const amount = NaN;
            const fromCurrency = "HUF";
            const toCurrency = "USD";
            const mockedExchangeRate = 2;
            const errorMessage = 'Invalid amount input.';
            const expectedError = new UnableToFetchExchangeRateError(errorMessage);
    
            mockExchangeRateService.getExchangeRate.calledWith(fromCurrency,toCurrency).mockReturnValue(mockedExchangeRate);
    
            // Act
    
            // Assert
            expect( ()=> currencyConverter.Convert(amount, fromCurrency, toCurrency)).toThrow(expectedError);
        });

        it('should throw error to because fromCurrency and toCurrency is empty ',()=>{
            // Arrange
            const amount = 1000;
            const fromCurrency = "";
            const toCurrency = "";
            const errorMessage = "Unable to fetch exchange rate.";
            const expectedError = new UnableToFetchExchangeRateError(errorMessage);
    
            mockExchangeRateService.getExchangeRate.calledWith(fromCurrency,toCurrency).mockImplementation(()=> { throw expectedError} );
    
            // Assert
            expect( () => currencyConverter.Convert(amount, fromCurrency, toCurrency)).toThrow(expectedError);
        });
    
        it('should throw error to because fromCurrency is empty ',()=>{
            // Arrange
            const amount = 1000;
            const fromCurrency = "";
            const toCurrency = "USD";
            const errorMessage = "Unable to fetch exchange rate.";
            const expectedError = new UnableToFetchExchangeRateError(errorMessage)
    
            mockExchangeRateService.getExchangeRate.calledWith(fromCurrency,toCurrency).mockImplementation(()=> { throw expectedError} );
    
            // Assert
            expect( () => currencyConverter.Convert(amount, fromCurrency, toCurrency)).toThrow(expectedError);
        });

        it('should throw error to because toCurrency is empty ',()=>{
            // Arrange
            const amount = 1000;
            const fromCurrency = "HUF";
            const toCurrency = "";
            const errorMessage = "Unable to fetch exchange rate.";
            const expectedError = new UnableToFetchExchangeRateError(errorMessage);
    
            mockExchangeRateService.getExchangeRate.calledWith(fromCurrency,toCurrency).mockImplementation(()=> { throw expectedError} );
    
            // Assert
            expect( () => currencyConverter.Convert(amount, fromCurrency, toCurrency)).toThrow(expectedError);
        });
    });
})