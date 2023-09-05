using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace __EntityNameCapitalized__sApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class __EntityNameCapitalized__Controller : ControllerBase
    {
        private readonly MyContext _context;
        private __EntityNameCapitalized__Business _business;

        public __EntityNameCapitalized__Controller(MyContext context)
        {
            _context = context;
            _business = new __EntityNameCapitalized__Business(_context);
        }

        // GET: api/__EntityNameCapitalized__
        [HttpGet]
        [RequiredPermissions(AppPermission.__EntityNameCapitalized__Read)]
        public ActionResult<QueryResult<ClientQuery, __EntityNameCapitalized__View>> Get__EntityNameCapitalized__s([FromQuery] __EntityNameCapitalized__Query query)
        {
            var dataQuery = _business.ConvertToDataQuery(query);

            var result = _business.GetAll(query, dataQuery);
            return result;
        }

        // GET: api/__EntityNameCapitalized__/5
        [HttpGet("{id}")]
        [RequiredPermissions(AppPermission.__EntityNameCapitalized__Read)]
        public ActionResult<__EntityNameCapitalized__View> Get__EntityNameCapitalized__(string id)
        {
            var __EntityName__ = _business.GetById(id);

            if (__EntityName__ == null)
            {
                return NotFound();
            }

            return __EntityName__;
        }

        // PUT: api/__EntityNameCapitalized__/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [RequiredPermissions(AppPermission.__EntityNameCapitalized__Update)]
        public ActionResult<__EntityNameCapitalized__View> Put__EntityNameCapitalized__(string id, __EntityNameCapitalized__Update __EntityName__)
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
                var updated = _business.Update(id, __EntityName__);
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
        [RequiredPermissions(AppPermission.__EntityNameCapitalized__Update)]
        public ActionResult<__EntityNameCapitalized__View> Patch__EntityNameCapitalized__(string id, JsonElement __EntityName__)
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
                var updated = _business.Modify(id, __EntityName__);
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
        [RequiredPermissions(AppPermission.__EntityNameCapitalized__Create)]
        public ActionResult<__EntityNameCapitalized__View> Post__EntityNameCapitalized__(__EntityNameCapitalized__Create __EntityName__)
        {
            var created = _business.Create(__EntityName__);

            return created;
        }

        // DELETE: api/__EntityNameCapitalized__/5
        [HttpDelete("{id}")]
        [RequiredPermissions(AppPermission.__EntityNameCapitalized__Delete)]
        public ActionResult<__EntityNameCapitalized__View> Delete__EntityNameCapitalized__(string id)
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

        private bool __EntityNameCapitalized__Exists(string id)
        {
            return _context.Set<__EntityNameCapitalized__>().Any(e => e.Id == id);
        }
    }
}
