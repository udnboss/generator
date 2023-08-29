using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ItemsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly DbContext _context;
        private ItemBusiness _business;

        public ItemController(DbContext context)
        {
            _context = context;
            _business = new ItemBusiness(_context);
        }

        // GET: api/Item
        [HttpGet]
        public ActionResult<QueryResult<ClientQuery, ItemView>> GetItems([FromQuery] ItemQuery query)
        {
            var dataQuery = _business.ConvertToDataQuery(query);

            var result = _business.GetAll(query, dataQuery);
            return result;
        }

        // GET: api/Item/5
        [HttpGet("{id}")]
        public ActionResult<ItemView> GetItem(Guid id)
        {
            if (_context.Items == null)
            {
                return NotFound();
            }

            var item = _business.GetById(id);

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }

        // PUT: api/Item/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public ActionResult<ItemView> PutItem(Guid id, ItemUpdate item)
        {
            try 
            {
                var existingItem = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Update(id, item);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

        }

        // PATCH: api/Item/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id}")]
        public ActionResult<ItemView> PatchItem(Guid id, JsonElement item)
        {
            try 
            {
                var existingItem = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Modify(id, item);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            
        }

        // POST: api/Item
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public ActionResult<ItemView> PostItem(ItemCreate item)
        {
            var created = _business.Create(item);

            return created;
        }

        // DELETE: api/Item/5
        [HttpDelete("{id}")]
        public ActionResult<ItemView> DeleteItem(Guid id)
        {
            try 
            {
                var existingItem = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            var deleted =_business.Delete(id);

            return deleted;
        }

        private bool ItemExists(Guid id)
        {
            return (_context.Set<Item>().Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
