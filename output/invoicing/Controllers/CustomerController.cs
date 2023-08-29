using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CustomersApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly DbContext _context;
        private CustomerBusiness _business;

        public CustomerController(DbContext context)
        {
            _context = context;
            _business = new CustomerBusiness(_context);
        }

        // GET: api/Customer
        [HttpGet]
        public ActionResult<QueryResult<ClientQuery, CustomerView>> GetCustomers([FromQuery] CustomerQuery query)
        {
            var dataQuery = _business.ConvertToDataQuery(query);

            var result = _business.GetAll(query, dataQuery);
            return result;
        }

        // GET: api/Customer/5
        [HttpGet("{id}")]
        public ActionResult<CustomerView> GetCustomer(Guid id)
        {
            if (_context.Customers == null)
            {
                return NotFound();
            }

            var customer = _business.GetById(id);

            if (customer == null)
            {
                return NotFound();
            }

            return customer;
        }

        // PUT: api/Customer/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public ActionResult<CustomerView> PutCustomer(Guid id, CustomerUpdate customer)
        {
            try 
            {
                var existingCustomer = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Update(id, customer);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

        }

        // PATCH: api/Customer/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id}")]
        public ActionResult<CustomerView> PatchCustomer(Guid id, JsonElement customer)
        {
            try 
            {
                var existingCustomer = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Modify(id, customer);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            
        }

        // POST: api/Customer
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public ActionResult<CustomerView> PostCustomer(CustomerCreate customer)
        {
            var created = _business.Create(customer);

            return created;
        }

        // DELETE: api/Customer/5
        [HttpDelete("{id}")]
        public ActionResult<CustomerView> DeleteCustomer(Guid id)
        {
            try 
            {
                var existingCustomer = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            var deleted =_business.Delete(id);

            return deleted;
        }

        private bool CustomerExists(Guid id)
        {
            return (_context.Set<Customer>().Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
