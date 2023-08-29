using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace SalesApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private readonly DbContext _context;
        private SaleBusiness _business;

        public SaleController(DbContext context)
        {
            _context = context;
            _business = new SaleBusiness(_context);
        }

        // GET: api/Sale
        [HttpGet]
        public ActionResult<QueryResult<ClientQuery, SaleView>> GetSales([FromQuery] SaleQuery query)
        {
            var dataQuery = _business.ConvertToDataQuery(query);

            var result = _business.GetAll(query, dataQuery);
            return result;
        }

        // GET: api/Sale/5
        [HttpGet("{id}")]
        public ActionResult<SaleView> GetSale(Guid id)
        {
            if (_context.Sales == null)
            {
                return NotFound();
            }

            var sale = _business.GetById(id);

            if (sale == null)
            {
                return NotFound();
            }

            return sale;
        }

        // PUT: api/Sale/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public ActionResult<SaleView> PutSale(Guid id, SaleUpdate sale)
        {
            try 
            {
                var existingSale = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Update(id, sale);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

        }

        // PATCH: api/Sale/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id}")]
        public ActionResult<SaleView> PatchSale(Guid id, JsonElement sale)
        {
            try 
            {
                var existingSale = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Modify(id, sale);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            
        }

        // POST: api/Sale
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public ActionResult<SaleView> PostSale(SaleCreate sale)
        {
            var created = _business.Create(sale);

            return created;
        }

        // DELETE: api/Sale/5
        [HttpDelete("{id}")]
        public ActionResult<SaleView> DeleteSale(Guid id)
        {
            try 
            {
                var existingSale = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            var deleted =_business.Delete(id);

            return deleted;
        }

        private bool SaleExists(Guid id)
        {
            return (_context.Set<Sale>().Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
