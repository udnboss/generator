using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace __EntityNameCapitalized__sApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class __EntityNameCapitalized__Controller : ControllerBase
    {
        private readonly SalesContext _context;
        private __EntityNameCapitalized__Business _business;

        public __EntityNameCapitalized__Controller(SalesContext context)
        {
            _context = context;
            _business = new __EntityNameCapitalized__Business(_context);
        }

        // GET: api/__EntityNameCapitalized__
        [HttpGet]
        public ActionResult<QueryResult<ClientQuery, __EntityNameCapitalized__View>> Get__EntityNameCapitalized__s([FromQuery] __EntityNameCapitalized__Query query)
        {
            var dataQuery = _business.ConvertToDataQuery(query);

            var result = _business.GetAll(query, dataQuery);
            return result;
        }

        // GET: api/__EntityNameCapitalized__/5
        [HttpGet("{id}")]
        public ActionResult<__EntityNameCapitalized__View> Get__EntityNameCapitalized__(Guid id)
        {
            if (_context.__EntityNameCapitalized__s == null)
            {
                return NotFound();
            }

            var account = _business.GetById(id);

            if (account == null)
            {
                return NotFound();
            }

            return account;
        }

        // PUT: api/__EntityNameCapitalized__/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public ActionResult<__EntityNameCapitalized__View> Put__EntityNameCapitalized__(Guid id, __EntityNameCapitalized__Update account)
        {
            try 
            {
                var existing__EntityNameCapitalized__ = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Update(id, account);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!__EntityNameCapitalized__Exists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

        }

        // PATCH: api/__EntityNameCapitalized__/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id}")]
        public ActionResult<__EntityNameCapitalized__View> Patch__EntityNameCapitalized__(Guid id, JsonElement account)
        {
            try 
            {
                var existing__EntityNameCapitalized__ = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Modify(id, account);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!__EntityNameCapitalized__Exists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            
        }

        // POST: api/__EntityNameCapitalized__
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public ActionResult<__EntityNameCapitalized__View> Post__EntityNameCapitalized__(__EntityNameCapitalized__Create account)
        {
            if (_context.__EntityNameCapitalized__s == null)
            {
                return Problem("Entity set '__EntityNameCapitalized__sContext.__EntityNameCapitalized__s' is null.");
            }

            var created = _business.Create(account);

            return created;
        }

        // DELETE: api/__EntityNameCapitalized__/5
        [HttpDelete("{id}")]
        public ActionResult<__EntityNameCapitalized__View> Delete__EntityNameCapitalized__(Guid id)
        {
            try 
            {
                var existing__EntityNameCapitalized__ = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            var deleted =_business.Delete(id);

            return deleted;
        }

        private bool __EntityNameCapitalized__Exists(Guid id)
        {
            return (_context.__EntityNameCapitalized__s?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
