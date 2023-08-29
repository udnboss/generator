using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CompanysApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly DbContext _context;
        private CompanyBusiness _business;

        public CompanyController(DbContext context)
        {
            _context = context;
            _business = new CompanyBusiness(_context);
        }

        // GET: api/Company
        [HttpGet]
        public ActionResult<QueryResult<ClientQuery, CompanyView>> GetCompanys([FromQuery] CompanyQuery query)
        {
            var dataQuery = _business.ConvertToDataQuery(query);

            var result = _business.GetAll(query, dataQuery);
            return result;
        }

        // GET: api/Company/5
        [HttpGet("{id}")]
        public ActionResult<CompanyView> GetCompany(Guid id)
        {
            if (_context.Companys == null)
            {
                return NotFound();
            }

            var company = _business.GetById(id);

            if (company == null)
            {
                return NotFound();
            }

            return company;
        }

        // PUT: api/Company/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public ActionResult<CompanyView> PutCompany(Guid id, CompanyUpdate company)
        {
            try 
            {
                var existingCompany = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Update(id, company);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CompanyExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

        }

        // PATCH: api/Company/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id}")]
        public ActionResult<CompanyView> PatchCompany(Guid id, JsonElement company)
        {
            try 
            {
                var existingCompany = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Modify(id, company);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CompanyExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            
        }

        // POST: api/Company
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public ActionResult<CompanyView> PostCompany(CompanyCreate company)
        {
            var created = _business.Create(company);

            return created;
        }

        // DELETE: api/Company/5
        [HttpDelete("{id}")]
        public ActionResult<CompanyView> DeleteCompany(Guid id)
        {
            try 
            {
                var existingCompany = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            var deleted =_business.Delete(id);

            return deleted;
        }

        private bool CompanyExists(Guid id)
        {
            return (_context.Set<Company>().Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
