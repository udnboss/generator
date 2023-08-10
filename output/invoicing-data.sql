insert into [account] ([id], [label], [bank_name], [bank_address], [bank_swift], [account_name], [account_iban], [account_address]) values ('550e8400-e29b-41d4-a716-446655440000', 'fransi', 'Bank of America', 'Riyad Bank, King Abdulaziz Road, Al Adama, Eastern Province 31952', 'RIBLSARI', 'Ahmed Ali', 'SA44 2000 0001 2345 6789 1234', 'P.O. Box 22622 Riyadh 11416 Saudi Arabia');
insert into [account] ([id], [label], [bank_name], [bank_address], [bank_swift], [account_name], [account_iban], [account_address]) values ('550e8400-e29b-41d4-a716-446655440001', 'ncb', 'Chase', 'Banque Saudi Fransi, Prince Faisal Bin Fahd Road, Al Khobar, Eastern Province 34429', 'BSFRSARI', 'Fatima Hassan', 'SA03 5500 0000 5678 9012 3456', 'P.O. Box 56006 Riyadh 11554 Saudi Arabia');
insert into [account] ([id], [label], [bank_name], [bank_address], [bank_swift], [account_name], [account_iban], [account_address]) values ('550e8400-e29b-41d4-a716-446655440002', 'sab', 'Wells Fargo', 'Al Rajhi Bank, King Fahd Road, Riyadh, Riyadh Province 11432', 'RJHISARI', 'Omar Khan', 'SA32 8000 0000 6080 1016 7519', 'P.O. Box 28 Riyadh 11411 Saudi Arabia');
insert into [account] ([id], [label], [bank_name], [bank_address], [bank_swift], [account_name], [account_iban], [account_address]) values ('550e8400-e29b-41d4-a716-446655440003', 'albilad', 'Citibank', 'Bank AlJazira, King Abdullah Road, Jeddah, Makkah Province 23441', 'BJAZSAJE', 'Sara Mohammed', 'SA29 6000 0000 0068 1000 0014', 'P.O. Box 6277 Jeddah 21442 Saudi Arabia');

insert into [category] ([id], [name]) values ('550e8400-e29b-41d4-a716-446655440000', 'books');
insert into [category] ([id], [name]) values ('550e8400-e29b-41d4-a716-446655440001', 'electronics');
insert into [category] ([id], [name]) values ('550e8400-e29b-41d4-a716-446655440002', 'clothing');
insert into [category] ([id], [name]) values ('550e8400-e29b-41d4-a716-446655440003', 'toys');

insert into [company] ([id], [name], [address], [crn], [trn], [contact], [mobile], [email]) values ('550e8400-e29b-41d4-a716-446655440000', 'Microsoft', 'One Microsoft Way, Redmond, WA 98052', '600413485', '12-3456789', '(425) 882-8080', '+1 (425) 882-8080', 'info@microsoft.com');
insert into [company] ([id], [name], [address], [crn], [trn], [contact], [mobile], [email]) values ('550e8400-e29b-41d4-a716-446655440001', 'Google', '1600 Amphitheatre Parkway, Mountain View, CA 94043', '358269703', '94-3203695', '(650) 253-0000', '+1 (650) 253-0000', 'press@google.com');
insert into [company] ([id], [name], [address], [crn], [trn], [contact], [mobile], [email]) values ('550e8400-e29b-41d4-a716-446655440002', 'Apple', '1 Apple Park Way, Cupertino, CA 95014', '942404361', '91-1144442', '(408) 996-1010', '+1 (408) 996-1010', 'media.help@apple.com');
insert into [company] ([id], [name], [address], [crn], [trn], [contact], [mobile], [email]) values ('550e8400-e29b-41d4-a716-446655440003', 'Amazon', '410 Terry Ave N, Seattle, WA 98109', '916284817', '91-1643330', '(206) 266-1000', '+1 (206) 266-1000', 'ecr-replies@amazon.com');

insert into [currency] ([id], [name], [symbol]) values ('USD', 'United States Dollar', '$');
insert into [currency] ([id], [name], [symbol]) values ('EUR', 'Euro', '€');
insert into [currency] ([id], [name], [symbol]) values ('JPY', 'Japanese Yen', '¥');
insert into [currency] ([id], [name], [symbol]) values ('GBP', 'British Pound', '£');

insert into [customer] ([id], [name], [address], [contact], [currency_id], [payment_term]) values ('550e8400-e29b-41d4-a716-446655440000', 'John Doe', '123 Main St, Anytown USA', '+1 (555) 555-5555', 'USD', 30);
insert into [customer] ([id], [name], [address], [contact], [currency_id], [payment_term]) values ('550e8400-e29b-41d4-a716-446655440001', 'Jane Smith', '456 Elm St, Anytown USA', '+1 (555) 555-5556', 'EUR', 60);
insert into [customer] ([id], [name], [address], [contact], [currency_id], [payment_term]) values ('550e8400-e29b-41d4-a716-446655440002', 'Bob Johnson', '789 Oak St, Anytown USA', '+1 (555) 555-5557', 'JPY', 90);
insert into [customer] ([id], [name], [address], [contact], [currency_id], [payment_term]) values ('550e8400-e29b-41d4-a716-446655440003', 'Alice Williams', '321 Pine St, Anytown USA', '+1 (555) 555-5558', 'GBP', 120);

insert into [item] ([id], [name]) values ('550e8400-e29b-41d4-a716-446655440000', 'Microsoft Office');
insert into [item] ([id], [name]) values ('550e8400-e29b-41d4-a716-446655440001', 'Adobe Creative Cloud');
insert into [item] ([id], [name]) values ('550e8400-e29b-41d4-a716-446655440002', 'Salesforce CRM');
insert into [item] ([id], [name]) values ('550e8400-e29b-41d4-a716-446655440003', 'Slack');

insert into [sale] ([id], [account_id], [company_id], [customer_id], [place], [number], [date], [currency_id], [total], [due_date], [reference_date], [confirmed]) values ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'New York, NY', 1, '2023-01-01', 'USD', 0, '2023-02-01', '2023-01-01', 1);
insert into [sale] ([id], [account_id], [company_id], [customer_id], [place], [number], [date], [currency_id], [total], [due_date], [reference_date], [confirmed]) values ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Los Angeles, CA', 2, '2023-02-01', 'EUR', 0, '2023-03-01', '2023-02-01', 1);
insert into [sale] ([id], [account_id], [company_id], [customer_id], [place], [number], [date], [currency_id], [total], [due_date], [reference_date], [confirmed]) values ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Chicago, IL', 3, '2023-03-01', 'JPY', 0, '2023-04-01', '2023-03-01', 0);
insert into [sale] ([id], [account_id], [company_id], [customer_id], [place], [number], [date], [currency_id], [total], [due_date], [reference_date], [confirmed]) values ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Houston, TX', 4, '2023-04-01', 'GBP', 0, '2023-05-01', '2023-04-01', 0);

insert into [saleItem] ([id], [sale_id], [item_id], [quantity], [price]) values ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 1, 15.99);
insert into [saleItem] ([id], [sale_id], [item_id], [quantity], [price]) values ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 2, 534.95);
insert into [saleItem] ([id], [sale_id], [item_id], [quantity], [price]) values ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 3, 42.0);
insert into [saleItem] ([id], [sale_id], [item_id], [quantity], [price]) values ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 2, 67.8);