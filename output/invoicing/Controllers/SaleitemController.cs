using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace SaleitemsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleitemController : ControllerBase
    {
        private readonly DbContext _context;
        private SaleitemBusiness _business;

        public SaleitemController(DbContext context)
        {
            _context = context;
            _business = new SaleitemBusiness(_context);
        }

        // GET: api/Saleitem
        [HttpGet]
        public ActionResult<QueryResult<ClientQuery, SaleitemView>> GetSaleitems([FromQuery] SaleitemQuery query)
        {
            var dataQuery = _business.ConvertToDataQuery(query);

            var result = _business.GetAll(query, dataQuery);
            return result;
        }

        // GET: api/Saleitem/5
        [HttpGet("{id}")]
        public ActionResult<SaleitemView> GetSaleitem(Guid id)
        {
            if (_context.Saleitems == null)
            {
                return NotFound();
            }

            var saleItem = _business.GetById(id);

            if (saleItem == null)
            {
                return NotFound();
            }

            return saleItem;
        }

        // PUT: api/Saleitem/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public ActionResult<SaleitemView> PutSaleitem(Guid id, SaleitemUpdate saleItem)
        {
            try 
            {
                var existingSaleitem = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Update(id, saleItem);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleitemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

        }

        // PATCH: api/Saleitem/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id}")]
        public ActionResult<SaleitemView> PatchSaleitem(Guid id, JsonElement saleItem)
        {
            try 
            {
                var existingSaleitem = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Modify(id, saleItem);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleitemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            
        }

        // POST: api/Saleitem
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public ActionResult<SaleitemView> PostSaleitem(SaleitemCreate saleItem)
        {
            var created = _business.Create(saleItem);

            return created;
        }

        // DELETE: api/Saleitem/5
        [HttpDelete("{id}")]
        public ActionResult<SaleitemView> DeleteSaleitem(Guid id)
        {
            try 
            {
                var existingSaleitem = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            var deleted =_business.Delete(id);

            return deleted;
        }

        private bool SaleitemExists(Guid id)
        {
            return (_context.Set<Saleitem>().Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
