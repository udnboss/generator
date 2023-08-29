using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CategorysApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly DbContext _context;
        private CategoryBusiness _business;

        public CategoryController(DbContext context)
        {
            _context = context;
            _business = new CategoryBusiness(_context);
        }

        // GET: api/Category
        [HttpGet]
        public ActionResult<QueryResult<ClientQuery, CategoryView>> GetCategorys([FromQuery] CategoryQuery query)
        {
            var dataQuery = _business.ConvertToDataQuery(query);

            var result = _business.GetAll(query, dataQuery);
            return result;
        }

        // GET: api/Category/5
        [HttpGet("{id}")]
        public ActionResult<CategoryView> GetCategory(Guid id)
        {
            if (_context.Categorys == null)
            {
                return NotFound();
            }

            var category = _business.GetById(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // PUT: api/Category/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public ActionResult<CategoryView> PutCategory(Guid id, CategoryUpdate category)
        {
            try 
            {
                var existingCategory = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Update(id, category);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

        }

        // PATCH: api/Category/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id}")]
        public ActionResult<CategoryView> PatchCategory(Guid id, JsonElement category)
        {
            try 
            {
                var existingCategory = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Modify(id, category);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            
        }

        // POST: api/Category
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public ActionResult<CategoryView> PostCategory(CategoryCreate category)
        {
            var created = _business.Create(category);

            return created;
        }

        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        public ActionResult<CategoryView> DeleteCategory(Guid id)
        {
            try 
            {
                var existingCategory = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            var deleted =_business.Delete(id);

            return deleted;
        }

        private bool CategoryExists(Guid id)
        {
            return (_context.Set<Category>().Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
